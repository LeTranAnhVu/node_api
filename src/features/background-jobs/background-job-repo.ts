import dbContext from '../../db/db-context'
import type BackgroundJob from './BackgroundJob'
import type { BackgroundJobStatus } from './BackgroundJob'

const tableName = 'background_jobs'

async function queryAll(): Promise<BackgroundJob[]> {
    return dbContext.select('*').from<BackgroundJob>(tableName)
}

async function getOne(id: number): Promise<BackgroundJob | null> {
    const result = await dbContext.select('*').from<BackgroundJob>(tableName).where('id', id)
    return Array.isArray(result) ? result[0] : null
}

async function insert(bckJob: Omit<BackgroundJob, 'id'>): Promise<BackgroundJob> {
    const createdRows = await dbContext.insert({ ...bckJob }, '*').into<BackgroundJob>(tableName)
    return createdRows[0]
}

async function updateStatusById(id: number, status: BackgroundJobStatus, percent: number | null): Promise<BackgroundJob> {
    const updatedRows = await dbContext<BackgroundJob>(tableName).where('id', id).update({ status }).update({ percent }).returning('*')
    return updatedRows[0]
}

async function update(bckJob: BackgroundJob): Promise<BackgroundJob> {
    const updatedRows = await dbContext<BackgroundJob>(tableName)
        .where('id', bckJob.id)
        .update({ ...bckJob }, '*')

    return updatedRows[0]
}

async function remove(id: number): Promise<number> {
    return dbContext<BackgroundJob>(tableName).where('id', id).delete()
}

const backgroundJobRepo = { queryAll, getOne, insert, remove, update, updateStatusById }
export default backgroundJobRepo
