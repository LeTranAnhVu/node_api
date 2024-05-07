import type { Knex } from 'knex'
import readSqlScript from '../helpers/read-sql-script'

export async function up(knex: Knex): Promise<void> {
    const fileName = '20240506183847_create-product-table.sql'
    const sqlScript = await readSqlScript(fileName)
    return knex.schema.raw(sqlScript)
}
