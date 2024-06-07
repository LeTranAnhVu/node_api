import { BadRequestError } from '../../common/exceptions/BadRequestError'
import { EntityNotFound } from '../../common/exceptions/EntityNotFound'
import type { BackgroundJob, BackgroundJobStatus, InsertBackgroupJob } from './BackgroundJob'
import { backgroundJobStatusValues } from './BackgroundJob'
import type InputBackgroundJobDto from './InputBackgroundJobDto'
import backgroundJobRepo from './background-job-repo'
import backgroundJobEvent from './background-job-event'

async function getAll(): Promise<BackgroundJob[]> {
    return backgroundJobRepo.queryAll()
}

async function getOne(id: number): Promise<BackgroundJob | null> {
    const item = await backgroundJobRepo.getOne(id)
    if (item == null) {
        throw new EntityNotFound('Background job', id)
    }

    return item
}

async function create(dto: InputBackgroundJobDto): Promise<BackgroundJob> {
    const newBckJob: InsertBackgroupJob = {
        name: dto.name,
        queue: dto.queue,
        status: dto.status,
        percent: dto.percent,
        createdAt: new Date(),
    }

    const payload = dto.payload
    const createdJob = await backgroundJobRepo.insert(newBckJob)
    backgroundJobEvent.emit('job:created', createdJob, payload)
    return createdJob
}

async function updateStatus(id: number, status: BackgroundJobStatus, percent?: number): Promise<BackgroundJob> {
    if (!backgroundJobStatusValues.includes(status)) {
        throw new BadRequestError(`Invalid background job status, '${status}'`)
    }

    let updatedPercent: number | null = percent ?? null
    if (status === 'succeeded' || status === 'failed') {
        updatedPercent = 100
    } else if (status === 'processing' && updatedPercent == null) {
        throw new BadRequestError(`Missing 'percent' field for status '${status}'`)
    } else if (status === 'created') {
        updatedPercent = null
    }

    const updatedBckJob = await backgroundJobRepo.updateStatusById(id, status, updatedPercent)

    if (!updatedBckJob) {
        throw new EntityNotFound('Background job', id)
    }

    return updatedBckJob
}

async function remove(id: number): Promise<void> {
    await backgroundJobRepo.remove(id)
}

const backgroundJobService = { getAll, getOne, create, updateStatus, remove }

export default backgroundJobService
