import { Router } from 'express'
import backgroundJobService from './background-job-service'
import { upsertBackgroundJobValidator } from './background-job-validators'

const router = Router()

router.get('/', async (req, res) => {
    const result = await backgroundJobService.getAll()
    res.json(result)
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const bckJob = await backgroundJobService.getOne(id)
        res.status(200).json(bckJob)
    } catch (e) {
        next(e)
    }
})
router.post('/', upsertBackgroundJobValidator, async (req, res, next) => {
    try {
        const dto = req.body
        const createdBckJob = await backgroundJobService.create(dto)
        res.status(200).json(createdBckJob)
    } catch (e) {
        next(e)
    }
})

router.put('/:id/status', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const { status, percent } = req.body
        const bckJob = await backgroundJobService.updateStatus(id, status, percent)
        res.status(200).json(bckJob)
    } catch (e) {
        next(e)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        await backgroundJobService.remove(id)
        res.status(204).send()
    } catch (e) {
        next(e)
    }
})

export const backgroundJobs = router
