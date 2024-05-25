export enum BackgroundJobStatus {
    Created = 'created',
    Processing = 'processing',
    Succeeced = 'succeeded',
    Failed = 'failed',
}

type BackgroundJob = {
    id: number
    name: string
    queue: string
    createdAt: Date
    status: BackgroundJobStatus
    percent: number | null
}

export default BackgroundJob
