import type Product from './Product'
import type InputProductDto from './InputProductDto'
import productRepo from './product-repo'
import { BadRequestError } from '../../common/exceptions/BadRequestError'
import { EntityNotFound } from '../../common/exceptions/EntityNotFound'
import chopToChunks from '../../common/helpers/chopToChunks'
import type { PagedItem } from '../../common/types/PagedItem'
import { readFile } from 'fs/promises'
import parseCSVBuffer from './utils/parseCSVBuffer'
import { createInputProductDto } from './InputProductDto'
import { createReadStream } from 'fs'
import * as csv from 'fast-csv'
import { Transform } from 'stream'
import { controlValve } from '../../common/helpers/stream/controlValve'
import { pipeline } from 'stream/promises'

async function getAll({ size, page }: { size: number; page: number }): Promise<PagedItem<Product>> {
    const total = await productRepo.countAll()
    const noOfPages = Math.ceil(total / size)
    const products = await productRepo.queryAll(size, (page - 1) * size)
    const result: PagedItem<Product> = {
        items: products,
        total,
        size,
        page,
        noOfPages,
    }

    return result
}

function create(dto: InputProductDto): Promise<Product> {
    const newProduct: Omit<Product, 'id'> = {
        name: dto.name,
        category: dto.category,
        image: dto.image,
        link: dto.link,
        ratings: dto.ratings,
        noOfRatings: dto.noOfRatings,
        price: dto.price,
    }

    return productRepo.insert(newProduct)
}

async function bulkCreate(dtos: InputProductDto[]): Promise<{
    completedCount: number
    successCount: number
    failedCount: number
}> {
    const chunkSize = Math.min(dtos.length, 10)
    const dtoChunks = chopToChunks(dtos, chunkSize)
    let completedCount = 0
    let successCount = 0
    let failedCount = 0
    for (const chunk of dtoChunks) {
        const newProducts = chunk.map(
            (dto: InputProductDto) =>
                ({
                    name: dto.name,
                    category: dto.category,
                    image: dto.image,
                    link: dto.link,
                    ratings: dto.ratings,
                    noOfRatings: dto.noOfRatings,
                    price: dto.price,
                }) as Omit<Product, 'id'>,
        )
        try {
            const createdProducts = await productRepo.insertMany(newProducts)
            successCount += createdProducts.length
        } catch (e) {
            failedCount += newProducts.length
        } finally {
            completedCount += newProducts.length
        }
    }
    return {
        completedCount: completedCount,
        successCount,
        failedCount,
    }
}

async function peakTotalRows(filePath: string): Promise<number> {
    const readable = createReadStream(filePath, { encoding: 'utf-8' })
    let rowCount = 0
    const stream = readable.pipe(csv.parse({ headers: true }))
    for await (const _ of stream) {
        rowCount++
    }

    return rowCount
}

async function bulkCreateFromFile(filePath: string): Promise<Transform> {
    const totalRows = await peakTotalRows(filePath)
    const readable = createReadStream(filePath, { encoding: 'utf-8' })
    const transformToDto = new Transform({
        objectMode: true,
        transform(chunk, encoding, callback): void {
            callback(null, createInputProductDto(chunk))
        },
    })

    const saveToDb = new Transform({
        objectMode: true,
        async transform(dtos, encoding, callback): Promise<void> {
            const result = await bulkCreate(dtos)
            callback(null, { ...result, totalCount: totalRows })
        },
    })

    const batchSize = Math.min(totalRows, 100)

    return readable
        .pipe(csv.parse({ headers: true }))
        .pipe(transformToDto)
        .pipe(controlValve(batchSize))
        .pipe(saveToDb)
}

async function update(id: number, dto: InputProductDto): Promise<Product> {
    if (id !== dto.id) {
        throw new BadRequestError('Not matching id')
    }

    const updatedProduct = await productRepo.update({
        ...dto,
        id: id,
    })

    if (!updatedProduct) {
        throw new EntityNotFound('Product', id)
    }

    return updatedProduct
}

async function remove(id: number): Promise<void> {
    const noOfProducts = await productRepo.remove(id)
    if (noOfProducts == 0) {
        throw new EntityNotFound('Product', id)
    }
}

const productService = { getAll, create, bulkCreateFromFile, remove, update }

export default productService
