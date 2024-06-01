import dbContext from '../../db/db-context'
import type Product from './models/Product'

const printableColumns = ['id', 'name', 'category', 'price', 'image', 'link', 'ratings', 'no_of_ratings'] as const
async function countAll(): Promise<number> {
    const result = await dbContext('products').count({ count: '*' })
    return Number(result[0].count)
}

async function queryAll(limit: number, offset: number, keyword?: string): Promise<Product[]> {
    // TODO any is not good, need to fix it.
    let query: any = dbContext
        .from<Product>('products')
        .select([...printableColumns])
        .orderBy('id')
        .limit(limit)
        .offset(offset)

    if (keyword && typeof keyword === 'string') {
        query = dbContext
            .from<Product>('products')
            .select([...printableColumns])
            .whereRaw(`full_text_search @@ websearch_to_tsquery(?)`, [keyword])
            .orderByRaw(`ts_rank(full_text_search, websearch_to_tsquery(?)) desc`, [keyword])
            .limit(limit)
            .offset(offset)
    }

    return query
}

async function insert(product: Omit<Product, 'id'>): Promise<Product> {
    const createdRows = await dbContext.insert({ ...product }, [...printableColumns]).into<Product>('products')
    return createdRows[0]
}

async function insertMany(products: Omit<Product, 'id'>[]): Promise<Product[]> {
    return await dbContext.insert([...products], [...printableColumns]).into<Product>('products')
}

async function update(product: Product): Promise<Product> {
    const updatedRows = await dbContext<Product>('products')
        .where('id', product.id)
        .update({ ...product }, [...printableColumns])

    return updatedRows[0]
}

async function remove(id: number): Promise<number> {
    return dbContext<Product>('products').where('id', id).delete()
}

const productRepo = { queryAll, insert, insertMany, remove, update, countAll }
export default productRepo
