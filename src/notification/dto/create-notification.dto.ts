import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateNotificationDto {
    @ApiProperty({example: 1, description: 'Client id'})
    @IsNumber()
    client_id: number;

    @ApiProperty({example: '+998901234567', description: 'Client phone number'})
    @IsString()
    phone: string

    @ApiProperty({example: 'Message', description: 'Message'})
    @IsString()
    message: string

}
