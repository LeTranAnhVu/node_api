import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import stringToNumber from '../../common/helpers/stringToNumber'

class InputProductDto {
    @IsOptional()
    @IsInt()
    id?: number

    @IsString()
    name: string

    @IsString()
    category: string

    @IsString()
    image: string

    @IsString()
    link: string

    @IsOptional()
    @IsNumber()
    ratings: number | null

    @IsNumber()
    noOfRatings: number

    @IsNumber()
    price: number

    constructor(
        name: string,
        category: string,
        image: string,
        link: string,
        ratings: number | null,
        noOfRatings: number,
        price: number,
        id?: number,
    ) {
        this.id = id
        this.name = name
        this.category = category
        this.image = image
        this.link = link
        this.ratings = ratings
        this.noOfRatings = noOfRatings
        this.price = price
    }
}

export function createInputProductDto(dto: any): InputProductDto {
    return new InputProductDto(
        dto.name,
        dto.category,
        dto.image,
        dto.link,
        stringToNumber(dto.ratings),
        stringToNumber(dto.noOfRatings),
        stringToNumber(dto.price),
        dto.id,
    )
}

export default InputProductDto
