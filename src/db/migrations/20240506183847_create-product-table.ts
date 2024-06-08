// import type { Knex } from 'knex'
import { sql, type Kysely } from 'kysely'
import readSqlScript from '../helpers/read-sql-script'
import type { Database } from '../schema'

export async function up(db: Kysely<Database>): Promise<void> {
    const fileName = '20240506183847_create-product-table.sql'
    const sqlScript = await readSqlScript(fileName)
    await sql.raw(sqlScript).execute(db)
}

export function down(db: Kysely<any>): void {
    console.error('Do nothing')
}
