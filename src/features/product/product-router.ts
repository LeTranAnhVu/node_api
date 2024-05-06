import { Router } from 'express'
import productService from './product-service'
const router = Router()

router.get('/', async (req, res) => {
    const products = await productService.getAll()
    res.json(products)
})

export const products = router
