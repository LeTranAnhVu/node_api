import { count, sql } from 'drizzle-orm'
import dbContext from '../../db/db-context'
import type { InsertProduct, Product } from './models/Product'
import { productTable } from './models/Product'

async function countAll(): Promise<number> {
    const result = await dbContext.select({ count: count() }).from(productTable)
    return result[0].count
}

async function queryAll(limit: number, offset: number, keyword?: string): Promise<(typeof Product)[]> {
    if (keyword && typeof keyword === 'string') {
        const query = dbContext
            .select()
            .from(productTable)
            .where(sql`full_text_search @@ websearch_to_tsquery(${keyword})`)
            .orderBy(sql`ts_rank(full_text_search, websearch_to_tsquery(${keyword})) desc`)
            .limit(limit)
            .offset(offset)
        return query
    } else {
        const query = dbContext.select().from(productTable).orderBy(productTable.id).limit(limit).offset(offset)
        return query
    }
}

async function insert(product: typeof InsertProduct): Promise<typeof Product> {
    const createdRow = await dbContext.insert(productTable).values(product).returning()
    return createdRow[0]
}

async function insertMany(products: (typeof InsertProduct)[]): Promise<(typeof Product)[]> {
    return await dbContext.insert(productTable).values(products).returning()
}

async function update(product: typeof Product): Promise<typeof Product> {
    const updatedRows = await dbContext
        .update(productTable)
        .set(product)
        .where(sql`${productTable.id} = ${product.id}`)
        .returning()

    return updatedRows[0]
}

async function remove(id: number): Promise<void> {
    await dbContext.delete(productTable).where(sql`${productTable.id} = ${id}`)
}

const productRepo = { queryAll, insert, insertMany, remove, update, countAll }
export default productRepo
