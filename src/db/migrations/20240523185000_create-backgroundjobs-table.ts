import type { Knex } from 'knex'
import readSqlScript from '../helpers/read-sql-script'
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    const fileName = '20240523185000_create-backgroundjobs-table.sql'
    const sqlScript = await readSqlScript(fileName)
    await sql.raw(sqlScript).execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
    console.error('Do nothing')
}
