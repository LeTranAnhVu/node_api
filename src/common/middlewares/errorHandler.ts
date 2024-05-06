import type { ErrorRequestHandler } from 'express'
import { EntityNotFound } from '../exceptions/EntityNotFound'

type ErrorResponse = {
    message: string
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
    let response: ErrorResponse = { message: 'Something went wrong' }
    // TODO we can send it to a log system
    console.error(err)
    if (err instanceof EntityNotFound) {
        response = { message: err.message }
        res.status(404).json(response)
        return
    }

    res.status(500).json(response)
}
