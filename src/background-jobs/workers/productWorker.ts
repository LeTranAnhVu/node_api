import { Worker } from 'bullmq'
import { CONNECTION } from '../config'
import productService from '../../features/product/product-service'
import type { ProductMessagePayload } from '../../common/messages/constants'
import { ProductQueue } from '../../common/messages/constants'

const processJob = async (job: any): Promise<void> => {
    if (job.name === ProductQueue.jobs.importCSV) {
        const { path, originalName } = job.data as ProductMessagePayload['importCSV']
        if (originalName.endsWith('.csv')) {
            await productService.bulkCreateFromFile(path)
        } else {
            console.log('Not a CSV file')
        }
    } else {
        console.log('No processor for job', job.name)
    }
}

const productWorker = new Worker(ProductQueue.name, processJob, { connection: CONNECTION })
export default productWorker
