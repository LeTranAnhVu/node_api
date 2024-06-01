import { Expose, plainToClass } from 'class-transformer'

class OutputProductDto {
    @Expose()
    id!: number

    @Expose()
    name!: string

    @Expose()
    category!: string

    @Expose()
    image!: string

    @Expose()
    link!: string

    @Expose()
    ratings!: number | null

    @Expose()
    noOfRatings!: number

    @Expose()
    price!: number
}

export function toOutputProductDto(json: object): OutputProductDto {
    return plainToClass(OutputProductDto, json, { excludeExtraneousValues: true })
}

export default OutputProductDto
