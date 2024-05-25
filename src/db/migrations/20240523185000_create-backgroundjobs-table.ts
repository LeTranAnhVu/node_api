import type { Knex } from 'knex'
import readSqlScript from '../helpers/read-sql-script'

export async function up(knex: Knex): Promise<void> {
    const fileName = '20240523185000_create-backgroundjobs-table.sql'
    const sqlScript = await readSqlScript(fileName)
    return knex.schema.raw(sqlScript)
}

export async function down(knex: Knex): Promise<void> {
    console.log('Do nothing')
}
