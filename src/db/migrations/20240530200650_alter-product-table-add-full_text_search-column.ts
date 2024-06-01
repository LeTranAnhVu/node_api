import type { Knex } from 'knex'
import readSqlScript from '../helpers/read-sql-script'

export async function up(knex: Knex): Promise<void> {
    const fileName = '20240530200650_alter-product-table-add-full_text_search-column.sql'
    const sqlScript = await readSqlScript(fileName)
    return knex.schema.raw(sqlScript)
}

export async function down(knex: Knex): Promise<void> {
    console.log('Do nothing')
}
