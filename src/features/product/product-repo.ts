import dbContext from '../../db/db-context'
import type Product from './Product'

async function queryAll(): Promise<Product[]> {
    return dbContext.select('*').from<Product>('products')
}

async function insert(product: Omit<Product, 'id'>): Promise<Product> {
    const createdRows = await dbContext.insert({ ...product }, '*').into<Product>('products')
    return createdRows[0]
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

const productRepo = { queryAll, insert, remove, update }
export default productRepo