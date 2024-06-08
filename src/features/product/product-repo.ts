import { sql } from 'kysely'
import { dbContext } from '../../db/kysely'
import type { KyProduct, KyProductInsert, KyProductUpdate } from './models/Product'

async function countAll(): Promise<number> {
    const result = await dbContext
        .selectFrom('products')
        .select(() => sql`count(id)::int`.as('count'))
        .execute()

    return Number(result[0].count)
}

async function queryAll(limit: number, offset: number, keyword?: string): Promise<KyProduct[]> {
    if (keyword && typeof keyword === 'string') {
        return dbContext
            .selectFrom('products')
            .selectAll()
            .where('fullTextSearch', '@@', sql`websearch_to_tsquery(${keyword})`)
            .orderBy(sql`ts_rank(full_text_search, websearch_to_tsquery(${keyword})) desc`)
            .limit(limit)
            .offset(offset)
            .execute()
    } else {
        return dbContext.selectFrom('products').selectAll().orderBy('id').limit(limit).offset(offset).execute()
    }
}

async function insert(product: KyProductInsert): Promise<KyProduct> {
    return dbContext.insertInto('products').values(product).returningAll().executeTakeFirstOrThrow()
}

async function insertMany(products: KyProductInsert[]): Promise<KyProduct[]> {
    return await dbContext
        .insertInto('products')
        .values([...products])
        .returningAll()
        .execute()
}

async function update(product: KyProductUpdate): Promise<KyProduct> {
    return await dbContext
        .updateTable('products')
        .set({ ...product })
        .where('id', '=', product.id)
        .returningAll()
        .executeTakeFirstOrThrow()
}

async function remove(id: number): Promise<number> {
    const result = await dbContext.deleteFrom('products').where('id', '=', id).executeTakeFirstOrThrow()
    return Number(result.numDeletedRows)
}

const productRepo = { queryAll, insert, insertMany, remove, update, countAll }
export default productRepo
