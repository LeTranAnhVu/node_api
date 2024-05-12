import { Router } from 'express'
import productService from './product-service'
import { upsertProductValidator } from './product-validators'
import createUploadMiddleware from '../../common/middlewares/createUploadMiddleware'
import { Readable } from 'stream'
import * as csv from 'fast-csv'
import { createInputProductDto } from './InputProductDto'
import { BadRequestError } from '../../common/exceptions/BadRequestError'

const upload = createUploadMiddleware()

const router = Router()

function parseCsvFromBuffer<T>(buffer: Buffer): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const records: T[] = []
        const stream = Readable.from(buffer)
        stream
            .pipe(csv.parse({ headers: true }))
            .on('data', (chunk) => records.push(chunk))
            .on('end', (rowCount: number) => resolve(records))
            .on('error', (error) => reject(error))
    })
}

router.get('/', async (req, res) => {
    const products = await productService.getAll()
    res.json(products)
})

router.post('/bulk-import', upload.single('file'), async (req, res, next) => {
    if (req.file?.buffer && req.file.originalname.endsWith('.csv')) {
        console.log('Start parsing csv ...')
        const buffer = req.file.buffer
        const rawRecords = await parseCsvFromBuffer(buffer)
        const inputProductDtos = rawRecords.map((rawRecord: any) => {
            return createInputProductDto(rawRecord)
        })

        try {
            const result = await productService.bulkCreate(inputProductDtos)
            return res.json({ success: result.success.length, failed: result.failed.length })
        } catch (e) {
            return next(e)
        }
    }

    return next(new BadRequestError('Unsupported file upload!'))
})

router.post('/', upsertProductValidator, async (req, res, next) => {
    try {
        const dto = req.body
        const createdProduct = await productService.create(dto)
        res.status(200).json(createdProduct)
    } catch (e) {
        next(e)
    }
})

router.put('/:id', upsertProductValidator, async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const dto = req.body
        const product = await productService.update(id, dto)
        res.status(200).json(product)
    } catch (e) {
        next(e)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        await productService.remove(id)
        res.status(204).send()
    } catch (e) {
        next(e)
    }
})

export const products = router
