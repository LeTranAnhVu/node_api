import { pgEnum, pgTable, serial, smallint, timestamp, varchar } from 'drizzle-orm/pg-core'

const backgroundJobStatus = pgEnum('status', ['created', 'processing', 'succeeded', 'failed'])

export type BackgroundJobStatus = (typeof backgroundJobStatus.enumValues)[number]
export const backgroundJobStatusValues = backgroundJobStatus.enumValues
export const backgroundJobTable = pgTable('background_jobs', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    queue: varchar('queue', { length: 100 }).notNull(),
    status: backgroundJobStatus('status').notNull(),
    percent: smallint('percent'),
    createdAt: timestamp('created_at').notNull(),
})

export type InsertBackgroupJob = typeof backgroundJobTable.$inferInsert
export type BackgroundJob = typeof backgroundJobTable.$inferSelect
