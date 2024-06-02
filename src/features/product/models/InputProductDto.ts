import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { Expose, Transform, plainToClass } from 'class-transformer'

class InputProductDto {
    @IsOptional()
    @IsInt()
    @Expose()
    id?: number

    @IsString()
    @Expose()
    name!: string

    @IsString()
    @Expose()
    category!: string

    @IsString()
    @Expose()
    image!: string

    @IsString()
    @Expose()
    link!: string

    @IsOptional()
    @IsNumber()
    @Expose()
    @Transform(({ value }) => (value === null ? null : Number(value)))
    ratings!: number | null

    @IsNumber()
    @Expose()
    @Transform(({ value }) => Number(value))
    noOfRatings!: number

    @IsNumber()
    @Expose()
    @Transform(({ value }) => Number(value))
    price!: number
}

export function toInputProductDto(json: object): InputProductDto {
    return plainToClass(InputProductDto, json, { excludeExtraneousValues: true })
}

export default InputProductDto
