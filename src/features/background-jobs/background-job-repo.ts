import { sql } from 'drizzle-orm'
import dbContext from '../../db/db-context'
import type { BackgroundJob, InsertBackgroupJob, BackgroundJobStatus } from './BackgroundJob'
import { backgroundJobTable } from './BackgroundJob'

async function queryAll(): Promise<BackgroundJob[]> {
    return dbContext.select().from(backgroundJobTable)
}

async function getOne(id: number): Promise<BackgroundJob | null> {
    const result = await dbContext
        .select()
        .from(backgroundJobTable)
        .where(sql`${backgroundJobTable.id} = ${id}`)

    return Array.isArray(result) ? result[0] : null
}

async function insert(bckJob: InsertBackgroupJob): Promise<BackgroundJob> {
    const createdRows = await dbContext.insert(backgroundJobTable).values(bckJob).returning()
    return createdRows[0]
}

async function updateStatusById(
    id: number,
    status: BackgroundJobStatus,
    percent: number | null,
): Promise<BackgroundJob> {
    const updatedRows = await dbContext
        .update(backgroundJobTable)
        .set({ status, percent })
        .where(sql`${backgroundJobTable.id} = ${id}`)
        .returning()
    return updatedRows[0]
}

async function update(bckJob: BackgroundJob): Promise<BackgroundJob> {
    const updatedRows = await dbContext
        .update(backgroundJobTable)
        .set(bckJob)
        .where(sql`${backgroundJobTable.id} = ${bckJob.id}`)
        .returning()

    return updatedRows[0]
}

async function remove(id: number): Promise<void> {
    await dbContext.delete(backgroundJobTable).where(sql`${backgroundJobTable.id} = ${id}`)
}

const backgroundJobRepo = { queryAll, getOne, insert, remove, update, updateStatusById }
export default backgroundJobRepo
