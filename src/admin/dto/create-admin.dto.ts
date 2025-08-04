import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength} from "class-validator";

export class Add_admin {
    @ApiProperty({example: 'Munisa', description: 'Admin name'})
    @IsString()
    login: string;

    @ApiProperty({example: 'Munisa22', description: 'Admin password'})
    @IsString()
    password: string;
}

export class Admin_login {
    @ApiProperty({example: 'Munisa', description: 'Admin name'})
    @IsString()
    login: string;

    @ApiProperty({example: 'Munisa22', description: 'Admin password'})
    @IsString()
    password: string;
}
