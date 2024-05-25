import { IsEnum, IsInt, IsObject, IsOptional, IsString } from 'class-validator'
import { BackgroundJobStatus } from './BackgroundJob'

class InputBackgroundJobDto {
    @IsOptional()
    @IsInt()
    id?: number

    @IsString()
    name!: string

    @IsString()
    queue!: string

    @IsEnum(BackgroundJobStatus)
    status!: BackgroundJobStatus

    @IsInt()
    @IsOptional()
    percent!: number | null

    @IsOptional()
    @IsObject()
    payload?: Record<string, any>

    constructor(dto: any) {
        this.id = dto.id
        this.name = dto.name
        this.queue = dto.queue
        this.status = dto.status
        this.percent = dto.percent
        this.payload = dto.payload
    }
}

export default InputBackgroundJobDto
