import type Product from './Product'
import type InputProductDto from './InputProductDto'
import productRepo from './product-repo'
import { BadRequestError } from '../../common/exceptions/BadRequestError'
import { EntityNotFound } from '../../common/exceptions/EntityNotFound'

function getAll(opt?: any): Promise<Product[]> {
    return productRepo.queryAll()
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

const productService = { getAll, create, remove, update }

export default productService
