import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { BackgroundJobStatus } from './BackgroundJob'

class InputBackgroundJobDto {
    @IsOptional()
    @IsInt()
    id?: number

    @IsString()
    name!: string

    @IsEnum(BackgroundJobStatus)
    status!: BackgroundJobStatus

    @IsInt()
    @IsOptional()
    percent!: number | null

    @IsDate()
    createdAt!: Date

    constructor(dto: any) {
        this.id = dto.id
        this.name = dto.name
        this.status = dto.status
        this.percent = dto.percent
        this.createdAt = dto.createdAt
    }
}

export default InputBackgroundJobDto
