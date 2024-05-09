import type { Express } from 'express'
import express from 'express'
import dotenv from 'dotenv'
import { errorHandler } from './common/middlewares/errorHandler'
import { products } from './features/product/product-router'
import dbContext from './db/db-context'

dotenv.configDotenv()
const port = process.env.PORT

const app: Express = express()
app.use(express.json())
app.use('/api/products', products)

app.use(errorHandler)

app.listen(port, () => {
    console.log('Server is running... port:', port)
})
