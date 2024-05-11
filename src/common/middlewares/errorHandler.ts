import type { ErrorRequestHandler } from 'express'
import { EntityNotFound } from '../exceptions/EntityNotFound'
import { BadRequestError } from '../exceptions/BadRequestError'
import { ValidationError } from 'class-validator'

type ErrorResponse = {
    message?: string
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

    if (err instanceof BadRequestError) {
        response = { message: err.message }
        res.status(400).json(response)
        return
    }

    if (Array.isArray(err) && err[0] instanceof ValidationError) {
        const validationErrors = err as ValidationError[]
        response = { message: validationErrors.map<string>((er) => er.toString()).join('/n') }
        res.status(400).json(response)
        return
    }

    if (err.statusCode) {
        response = { message: err.message }
        res.status(err.statusCode).json(response)
    } else {
        res.status(500).json(response)
    }
}
