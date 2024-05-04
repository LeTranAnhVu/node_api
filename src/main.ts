import type { Express, Request, Response } from 'express'
import express from 'express'
import dotenv from 'dotenv'

dotenv.configDotenv()

const app: Express = express()
const port = process.env.PORT

app.get('/', async (req: Request, res: Response) => {
    res.send('Return some data')
})

app.listen(port, () => {
    console.log('Server is running... port:', port)
})
