import { EventEmitter } from 'events'
import backgroundJobService from './background-job-service'
import { Queue } from 'bullmq'
import type { BackgroundJob } from './BackgroundJob'
const backgroundJobEvent = new EventEmitter()

function createJobIdString(id: number): string {
    return `background-job:${id}`
}

export function extractJobIdFromString(jobIdString: string): number {
    return Number(jobIdString.replace('background-job:', ''))
}

backgroundJobEvent.on('job:created', async (backgroundJob: BackgroundJob, payload: Record<string, any>) => {
    const queueName = backgroundJob.queue
    if (queueName) {
        new Queue(queueName).add(backgroundJob.name, payload, { jobId: createJobIdString(backgroundJob.id) })
    }
})

backgroundJobEvent.on('job:processing', async (backgroundId: number, percent: number) => {
    await backgroundJobService.updateStatus(backgroundId, 'processing', percent)
})

backgroundJobEvent.on('job:succeeded', async (backgroundId: number) => {
    await backgroundJobService.updateStatus(backgroundId, 'succeeded')
})

backgroundJobEvent.on('job:failed', (backgroundId) => {
    backgroundJobService.updateStatus(backgroundId, 'failed')
})

export default backgroundJobEvent
