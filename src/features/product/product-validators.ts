import { validate } from 'class-validator'
import type { MiddlewareFunction } from '../../common/types/MiddlerwareFunction'
import { plainToInstance } from 'class-transformer'
import InputProductDto from './InputProductDto'

export const upsertProductValidator: MiddlewareFunction = async (req, res, next) => {
    const inputProductDto = plainToInstance(InputProductDto, req.body)
    const errors = await validate(inputProductDto)
    if (errors.length > 0) {
        next(errors)
    }

    next()
}
