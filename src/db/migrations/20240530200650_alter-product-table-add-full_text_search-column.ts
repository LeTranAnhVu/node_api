import { sql, type Kysely } from 'kysely'
import readSqlScript from '../helpers/read-sql-script'

export async function up(db: Kysely<any>): Promise<void> {
    const fileName = '20240530200650_alter-product-table-add-full_text_search-column.sql'
    const sqlScript = await readSqlScript(fileName)
    await sql.raw(sqlScript).execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
    console.error('Do nothing')
}
