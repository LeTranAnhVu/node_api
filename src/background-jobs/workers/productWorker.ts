import { Worker } from 'bullmq'
import { CONNECTION } from '../config'
import productService from '../../features/product/product-service'
import type { ProductMessagePayload } from '../../features/product/messages/constants'
import { ProductQueue } from '../../features/product/messages/constants'
import backgroundJobEvent, { extractJobIdFromString } from '../../features/background-jobs/background-job-event'

const processJob = async (job: any): Promise<void> => {
    if (job.name === ProductQueue.jobs.importCSV) {
        const { path, originalName } = job.data as ProductMessagePayload['importCSV']
        if (originalName.endsWith('.csv')) {
            const backgroundId = extractJobIdFromString(job.id)
            const stream = await productService.bulkCreateFromFile(path)
            let completedCountSoFar = 0
            for await (const result of stream) {
                const { totalCount, completedCount } = result
                completedCountSoFar += completedCount
                const completedPercent = (completedCountSoFar / totalCount) * 100
                if (backgroundId && completedPercent % 5 === 0) {
                    backgroundJobEvent.emit('job:processing', backgroundId, Math.ceil(completedPercent))
                }
            }

            backgroundJobEvent.emit('job:succeeded', backgroundId)
            console.log(`Job ${job.id} done`)
        } else {
            console.log('Not a CSV file')
        }
    } else {
        console.log('No processor for job', job.name)
    }
}

const productWorker = new Worker(ProductQueue.name, processJob, { connection: CONNECTION })
export default productWorker
