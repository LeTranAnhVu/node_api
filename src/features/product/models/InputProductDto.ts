import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { Expose, plainToClass } from 'class-transformer'

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
    ratings!: number | null

    @IsNumber()
    @Expose()
    noOfRatings!: number

    @IsNumber()
    @Expose()
    price!: number
}

export function toInputProductDto(json: object): InputProductDto {
    return plainToClass(InputProductDto, json, { excludeExtraneousValues: true })
}

export default InputProductDto
