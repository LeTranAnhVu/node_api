import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator'

class InputProductDto {
    @IsOptional()
    @IsInt()
    id?: number

    @IsString()
    name!: string

    @IsString()
    category!: string

    @IsString()
    image!: string

    @IsString()
    link!: string

    @IsOptional()
    @IsNumber()
    ratings!: number | null

    @IsNumber()
    noOfRatings!: number

    @IsNumber()
    price!: number
}

export default InputProductDto
