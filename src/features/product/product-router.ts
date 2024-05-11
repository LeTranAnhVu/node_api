import { Router } from 'express'
import productService from './product-service'
import { upsertProductValidator } from './product-validators'
const router = Router()

router.get('/', async (req, res) => {
    const products = await productService.getAll()
    res.json(products)
})

router.post('/', upsertProductValidator, async (req, res, next) => {
    try {
        const dto = req.body
        const createdProduct = await productService.create(dto)
        res.status(200).json(createdProduct)
    } catch (e) {
        next(e)
    }
})

router.put('/:id', upsertProductValidator, async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const dto = req.body
        const product = await productService.update(id, dto)
        res.status(200).json(product)
    } catch (e) {
        next(e)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        await productService.remove(id)
        res.status(204).send()
    } catch (e) {
        next(e)
    }
})

export const products = router
