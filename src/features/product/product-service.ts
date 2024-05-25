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

async function* bulkCreateGenerator(
    dtos: InputProductDto[],
): AsyncGenerator<{ totalCount: number; completedCount: number; successCount: number; failedCount: number }> {
    const chunkSize = 10
    const dtoChunks = chopToChunks(dtos, chunkSize)
    let counter = 1
    const chunkLength = dtoChunks.length
    for (const chunk of dtoChunks) {
        let currentSuccessCount = 0
        let currentFailedCount = 0
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
            currentSuccessCount = createdProducts.length
        } catch (e) {
            currentFailedCount = newProducts.length
        } finally {
            counter++
            yield { totalCount: chunkLength, completedCount: counter, successCount: currentSuccessCount, failedCount: currentFailedCount }
        }
    }
}

async function* bulkCreateFromFileGenerator(
    filePath: string,
): AsyncGenerator<{ totalCount: number; completedCount: number; successCount: number; failedCount: number }> {
    const buffer = await readFile(filePath)
    const rawRecords = await parseCSVBuffer(buffer)
    const inputProductDtos = rawRecords.map((rawRecord: any) => {
        return createInputProductDto(rawRecord)
    })

    for await (const result of bulkCreateGenerator(inputProductDtos)) {
        yield result
    }
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

const productService = { getAll, create, bulkCreateFromFileGenerator, remove, update }

export default productService
