export enum BackgroundJobStatus {
    Created = 'created',
    Processing = 'processing',
    Succeeced = 'succeeded',
    Failed = 'failed',
}

type BackgroundJob = {
    id: number
    name: string
    createdAt: Date
    status: BackgroundJobStatus
    percent: number | null
}

export default BackgroundJob
