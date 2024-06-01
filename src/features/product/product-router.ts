import { Router } from 'express'
import productService from './product-service'
import { upsertProductValidator } from './product-validators'
import createUploadMiddleware from '../../common/middlewares/createUploadMiddleware'
import { BadRequestError } from '../../common/exceptions/BadRequestError'
import { ProductQueue } from './messages/constants'
import backgroundJobService from '../background-jobs/background-job-service'
import InputBackgroundJobDto from '../background-jobs/InputBackgroundJobDto'
import { BackgroundJobStatus } from '../background-jobs/BackgroundJob'
import { validate } from 'class-validator'

const upload = createUploadMiddleware()

const router = Router()

router.get('/', async (req, res) => {
    const size = Math.max(Number(req.query.size ?? 10), 1)
    const page = Math.max(Number(req.query.page ?? 1), 1)
    const keyword = req.query.keyword?.toString() || undefined
    const result = await productService.getAll({ page, size, keyword })
    res.json(result)
})

router.post('/bulk-import', upload.single('file'), async (req, res, next) => {
    if (req.file?.path && req.file.originalname.endsWith('.csv')) {
        try {
            let totalSuccessCount = 0
            let totalFailedCount = 0
            const stream = await productService.bulkCreateFromFile(req.file.path)
            for await (const { successCount, failedCount } of stream) {
                totalSuccessCount += successCount
                totalFailedCount += failedCount
            }

            return res.json({ success: totalSuccessCount, failed: totalFailedCount })
        } catch (e) {
            return next(e)
        }
    }

    return next(new BadRequestError('Unsupported file upload!'))
})

router.post('/async-import', upload.single('file'), async (req, res, next) => {
    if (req.file?.path && req.file.originalname.endsWith('.csv')) {
        try {
            const bckgroundJobDto = new InputBackgroundJobDto({
                name: ProductQueue.jobs.importCSV,
                queue: ProductQueue.name,
                status: BackgroundJobStatus.Created,
                percent: null,
                payload: {
                    path: req.file.path,
                    originalName: req.file.originalname,
                },
            })

            // TODO refactor it later. Let the service (applciation layer) handle the validation
            const errors = await validate(bckgroundJobDto)
            if (errors.length > 0) {
                return next(errors)
            }

            const job = await backgroundJobService.create(bckgroundJobDto)
            return res
                .status(201)
                .location(`/background-jobs/${job.id}`)
                .json({ message: 'Request is created!', ...job })
        } catch (e) {
            return next(e)
        }
    }

    return next(new BadRequestError('Unsupported file upload!'))
})

router.get('/async-import/:processId', (req, res, next) => {
    const { processId } = req.params
    return res.status(200).json({
        processId: Number(processId),
        status: 'in-process',
        percent: 20,
    })
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
