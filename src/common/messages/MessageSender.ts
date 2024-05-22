import { Queue } from 'bullmq'
import { CONNECTION } from '../../background-jobs/config'

export abstract class MessageSender {
    queueName: string
    queue: Queue

    constructor(queueName: string) {
        this.queueName = queueName
        this.queue = new Queue(this.queueName, { connection: CONNECTION })
    }

    async send(jobName: string, data: any): Promise<void> {
        console.log('Start sending the job ', jobName)
        await this.queue.add(jobName, data)
    }
}
