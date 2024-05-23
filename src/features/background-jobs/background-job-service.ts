import { BadRequestError } from '../../common/exceptions/BadRequestError'
import { EntityNotFound } from '../../common/exceptions/EntityNotFound'
import type BackgroundJob from './BackgroundJob'
import { BackgroundJobStatus } from './BackgroundJob'
import type InputBackgroundJobDto from './InputBackgroundJobDto'
import backgroundJobRepo from './background-job-repo'

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

function create(dto: InputBackgroundJobDto): Promise<BackgroundJob> {
    const newBckJob: Omit<BackgroundJob, 'id'> = {
        name: dto.name,
        status: dto.status,
        percent: dto.percent,
        createdAt: dto.createdAt,
    }

    return backgroundJobRepo.insert(newBckJob)
}

async function updateStatus(id: number, status: BackgroundJobStatus, percent?: number): Promise<BackgroundJob> {
    if (!Object.values(BackgroundJobStatus).includes(status)) {
        throw new BadRequestError(`Invalid background job status, '${status}'`)
    }

    let updatedPercent: number | null = percent ?? null
    if (status === BackgroundJobStatus.Succeeced || status === BackgroundJobStatus.Failed) {
        updatedPercent = 100
    } else if (status === BackgroundJobStatus.Processing && updatedPercent == null) {
        throw new BadRequestError(`Missing 'percent' field for status '${status}'`)
    } else if (status === BackgroundJobStatus.Created) {
        updatedPercent = null
    }

    const updatedBckJob = await backgroundJobRepo.updateStatusById(id, status, updatedPercent)

    if (!updatedBckJob) {
        throw new EntityNotFound('Background job', id)
    }

    return updatedBckJob
}

async function remove(id: number): Promise<void> {
    const noOfBckJobs = await backgroundJobRepo.remove(id)
    if (noOfBckJobs == 0) {
        throw new EntityNotFound('Background job', id)
    }
}

const backgroundJobService = { getAll, getOne, create, updateStatus, remove }

export default backgroundJobService
