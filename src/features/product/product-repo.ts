import dbContext from '../../db/db-context'
import type Product from './Product'

async function countAll(): Promise<number> {
    const result = await dbContext('products').count({ count: '*' })
    return Number(result[0].count)
}

async function queryAll(limit: number, offset: number): Promise<Product[]> {
    const query = dbContext.select('*').from<Product>('products').limit(limit).offset(offset).orderBy('id')
    return query
}

async function insert(product: Omit<Product, 'id'>): Promise<Product> {
    const createdRows = await dbContext.insert({ ...product }, '*').into<Product>('products')
    return createdRows[0]
}

async function insertMany(products: Omit<Product, 'id'>[]): Promise<Product[]> {
    return await dbContext.insert([...products], '*').into<Product>('products')
}

async function update(product: Product): Promise<Product> {
    const updatedRows = await dbContext<Product>('products')
        .where('id', product.id)
        .update({ ...product }, '*')

    return updatedRows[0]
}

async function remove(id: number): Promise<number> {
    return dbContext<Product>('products').where('id', id).delete()
}

const productRepo = { queryAll, insert, insertMany, remove, update, countAll }
export default productRepo
