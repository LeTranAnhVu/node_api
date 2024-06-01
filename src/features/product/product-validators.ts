import { validate } from 'class-validator'
import type { MiddlewareFunction } from '../../common/types/MiddlerwareFunction'
import { toInputProductDto } from './models/InputProductDto'

// TODO better move it to service layer then the middlerware, bc we have background jobs
export const upsertProductValidator: MiddlewareFunction = async (req, _, next) => {
    const dto = toInputProductDto(req.body)
    const errors = await validate(dto)
    if (errors.length > 0) {
        next(errors)
    }

    next()
}
