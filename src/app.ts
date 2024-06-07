import type { Express } from 'express'
import express from 'express'
import dotenv from 'dotenv'
import { errorHandler } from './common/middlewares/errorHandler'
import { products } from './features/product/product-router'
import { media } from './features/media/media-router'
import { backgroundJobs } from './features/background-jobs/background-job-router'

dotenv.configDotenv()
const port = process.env.PORT

const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/api/products', products)
app.use('/api/background-jobs', backgroundJobs)
app.use('/api/media', media)

app.use(errorHandler)

app.listen(port, () => {
    console.log('Server is running... port:', port)
})
