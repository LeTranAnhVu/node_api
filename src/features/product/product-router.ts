import { Router } from 'express'
import productService from './product-service'
import { upsertProductValidator } from './product-validators'
import createUploadMiddleware from '../../common/middlewares/createUploadMiddleware'
import { createInputProductDto } from './InputProductDto'
import { BadRequestError } from '../../common/exceptions/BadRequestError'
import parseCSVBuffer from './lib/parseCSVBuffer'

const upload = createUploadMiddleware()

const router = Router()

router.get('/', async (req, res) => {
    const size = Math.max(Number(req.query.size ?? 10), 1)
    const page = Math.max(Number(req.query.page ?? 1), 1)
    const result = await productService.getAll({ page: page, size: size })
    res.json(result)
})

router.post('/bulk-import', upload.single('file'), async (req, res, next) => {
    if (req.file?.buffer && req.file.originalname.endsWith('.csv')) {
        console.log('Start parsing CSV ...')
        const buffer = req.file.buffer
        const rawRecords = await parseCSVBuffer(buffer)
        const inputProductDtos = rawRecords.map((rawRecord: any) => {
            return createInputProductDto(rawRecord)
        })

        console.log('Parsing CSV completed!')
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
