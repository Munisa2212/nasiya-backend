import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class Add_debtor {
    @ApiProperty({example: 'Munisa', description: 'Debtor name'})
    @IsString()
    name:string

    @ApiProperty({example: ["+998901234567","+998901234567"], description: 'Debtor phone number'})
    phone: [string]

    @ApiProperty({example: ['image1.jpg','image2.jpg'], description: 'Debtor images'})
    image: [string]

    @ApiProperty({example: 'Address 1/2', description: 'Debtor address'})
    @IsString()
    address:string

    @ApiProperty({example: 'Note', description: 'Debtor note'})
    @IsString()
    note?: string
}

