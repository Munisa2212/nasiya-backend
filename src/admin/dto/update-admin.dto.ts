
import { PartialType } from '@nestjs/swagger';
import { Add_admin } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(Add_admin) {}
