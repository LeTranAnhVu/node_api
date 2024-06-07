import type InputProductDto from './models/InputProductDto'
import productRepo from './product-repo'
import { BadRequestError } from '../../common/exceptions/BadRequestError'
import { EntityNotFound } from '../../common/exceptions/EntityNotFound'
import chopToChunks from '../../common/helpers/chopToChunks'
import type { PagedItem } from '../../common/types/PagedItem'
import { createReadStream } from 'fs'
import * as csv from 'fast-csv'
import { Transform } from 'stream'
import { controlValve } from '../../common/helpers/stream/controlValve'
import { validate } from 'class-validator'
import { toInputProductDto } from './models/InputProductDto'
import type OutputProductDto from './models/OutputProductDto'
import { toOutputProductDto } from './models/OutputProductDto'
import type { InsertProduct } from './models/Product'

async function getAll({
    size,
    page,
    keyword,
}: {
    size: number
    page: number
    keyword?: string
}): Promise<PagedItem<OutputProductDto>> {
    const total = await productRepo.countAll()
    const noOfPages = Math.ceil(total / size)
    const products = await productRepo.queryAll(size, (page - 1) * size, keyword)
    const output = products.map(toOutputProductDto)
    const result: PagedItem<OutputProductDto> = {
        items: output,
        total,
        size,
        page,
        noOfPages,
    }

    return result
}

async function create(dto: InputProductDto): Promise<OutputProductDto> {
    const newProduct: typeof InsertProduct = {
        name: dto.name,
        category: dto.category,
        image: dto.image,
        link: dto.link,
        ratings: dto.ratings,
        noOfRatings: dto.noOfRatings,
        price: dto.price,
    }

    const product = await productRepo.insert(newProduct)
    return toOutputProductDto(product)
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
        const newProducts = chunk.map((dto: InputProductDto) => ({
            name: dto.name,
            category: dto.category,
            image: dto.image,
            link: dto.link,
            ratings: dto.ratings,
            noOfRatings: dto.noOfRatings,
            price: dto.price,
        }))

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
        async transform(chunk, encoding, callback): Promise<void> {
            const dto = toInputProductDto(chunk)
            const errors = await validate(dto)
            if (errors.length > 0) {
                // Skip the row
                console.log('Error:', errors.map((e) => e.toString()).join(', '))
                callback(null, null)
            } else {
                callback(null, dto)
            }
        },
    })

    const saveToDb = new Transform({
        objectMode: true,
        async transform(dtos, encoding, callback): Promise<void> {
            try {
                const result = await bulkCreate(dtos)
                callback(null, { ...result, totalCount: totalRows })
            } catch (e) {
                // SKip the row
                console.log('Error:', e)
                callback(null, null)
            }
        },
    })

    const batchSize = Math.min(totalRows, 100)

    return readable
        .pipe(csv.parse({ headers: true }))
        .pipe(transformToDto)
        .pipe(controlValve(batchSize))
        .pipe(saveToDb)
}

async function update(id: number, dto: InputProductDto): Promise<OutputProductDto> {
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

    return toOutputProductDto(updatedProduct)
}

async function remove(id: number): Promise<void> {
    await productRepo.remove(id)
}

const productService = { getAll, create, bulkCreateFromFile, remove, update }

export default productService
