import { validate } from 'class-validator'
import type { MiddlewareFunction } from '../../common/types/MiddlerwareFunction'
import InputBackgroundJobDto from './InputBackgroundJobDto'

export const upsertBackgroundJobValidator: MiddlewareFunction = async (req, res, next) => {
    const inputDto = new InputBackgroundJobDto({ ...req.body, createdAt: new Date(req.body.createdAt) })
    const errors = await validate(inputDto)
    if (errors.length > 0) {
        next(errors)
    }

    next()
}
