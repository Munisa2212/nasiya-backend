import { PartialType } from '@nestjs/swagger';
import { Add_seller } from './create-seller.dto';

export class UpdateSellerDto extends PartialType(Add_seller) {}
