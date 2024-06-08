import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export enum BackgroundJobStatus {
    Created = 'created',
    Processing = 'processing',
    Succeeced = 'succeeded',
    Failed = 'failed',
}

export interface BackgroundJobTable {
    id: Generated<number>
    name: string
    queue: string
    status: BackgroundJobStatus
    percent: number | null
    createdAt: Date
}

export type BackgroundJob = Selectable<BackgroundJobTable>
export type BackgroundJobInsert = Insertable<BackgroundJobTable>
export type BackgroundJobUpdate = Updateable<BackgroundJobTable> & { id: number }
