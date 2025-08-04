import { ApiProperty } from "@nestjs/swagger"
import { IsString, MaxLength, MinLength } from "class-validator"

export class Add_seller {
    @ApiProperty({example: 'Munisa', description: 'Seller name'})
    @IsString()
    name: string

    @ApiProperty({example: 'Munisa', description: 'Seller login'})
    @IsString()
    login: string

    @ApiProperty({example: 'Munisa22', description: 'Seller password'})
    @IsString()
    password: string
}


export class Login_seller{
    @ApiProperty({example: 'Munisa', description: 'Seller login'})
    @IsString()
    login: string

    @ApiProperty({example: 'Munisa22', description: 'Seller password'})
    @IsString()
    password: string
}
