import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsNumber, IsString } from "class-validator"

export class CreateCreditDto {
    @ApiProperty({example: 1, description: 'Debtor id'})
    @IsNumber()
    debtor_id: number

    @ApiProperty({example: '2025-07-30T13:44:19.316Z', description: 'Start date'})
    start_date: Date

    @ApiProperty({example: 12, description: 'Duration'})
    @IsNumber() 
    duration: number

    @ApiProperty({example: 1000000, description: 'Total amount'})
    @IsNumber()
    total_amount: number

    @ApiProperty({example: 'Product 1', description: 'Product name'})
    @IsString()
    product_name: string

    @ApiProperty({example: 'Note', description: 'Note'})
    @IsString()
    note?: string

    @ApiProperty({example: ['image1.jpg','image2.jpg'], description: 'Images'})
    images: string[]
}
