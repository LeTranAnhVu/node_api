import { dbContext } from '../../db/kysely'
import type { BackgroundJobStatus, BackgroundJob, BackgroundJobInsert, BackgroundJobUpdate } from './BackgroundJob'

async function queryAll(): Promise<BackgroundJob[]> {
    return dbContext.selectFrom('backgroundJobs').selectAll().execute()
}

async function getOne(id: number): Promise<BackgroundJob | null> {
    const result = await dbContext.selectFrom('backgroundJobs').selectAll().where('id', '=', id).executeTakeFirst()
    return result || null
}

async function insert(bckJob: BackgroundJobInsert): Promise<BackgroundJob> {
    const createdRow = await dbContext
        .insertInto('backgroundJobs')
        .values(bckJob)
        .returningAll()
        .executeTakeFirstOrThrow()

    return createdRow
}

async function updateStatusById(
    id: number,
    status: BackgroundJobStatus,
    percent: number | null,
): Promise<BackgroundJob> {
    const updatedRow = await dbContext
        .updateTable('backgroundJobs')
        .set({ status, percent })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

    return updatedRow
}

async function update(bckJob: BackgroundJobUpdate): Promise<BackgroundJob> {
    const updatedRow = await dbContext
        .updateTable('backgroundJobs')
        .set(bckJob)
        .where('id', '=', bckJob.id)
        .returningAll()
        .executeTakeFirstOrThrow()

    return updatedRow
}

async function remove(id: number): Promise<number> {
    const result = await dbContext.deleteFrom('backgroundJobs').where('id', '=', id).executeTakeFirstOrThrow()
    return Number(result.numDeletedRows)
}

const backgroundJobRepo = { queryAll, getOne, insert, remove, update, updateStatusById }
export default backgroundJobRepo
