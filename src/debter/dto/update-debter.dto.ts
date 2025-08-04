import { PartialType } from '@nestjs/swagger';
import { Add_debtor } from './create-debter.dto';

export class UpdateDebterDto extends PartialType(Add_debtor) {}
