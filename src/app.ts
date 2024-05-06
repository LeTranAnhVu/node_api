import type { Express } from 'express'
import express from 'express'
import dotenv from 'dotenv'
import { errorHandler } from './common/middlewares/errorHandler'
import { products } from './features/product/product-router'

dotenv.configDotenv()

const app: Express = express()
const port = process.env.PORT

app.use('/products', products)

app.use(errorHandler)

app.listen(port, () => {
    console.log('Server is running... port:', port)
})
