import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"


export class Payment{
    @ApiProperty({example: 1, description: 'Credit id'})
    @IsNumber()
    credit_id: number

    @ApiProperty({example: ['2025-07-30T13:44:19.316Z', '2025-07-30T13:44:19.316Z'], description: 'Payment dates'})
    data: [string]

    @ApiProperty({example: 1000000, description: 'Amount'})
    @IsNumber()
    amount: number
}
