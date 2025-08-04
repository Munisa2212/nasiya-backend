import { PartialType } from '@nestjs/swagger';
import { Payment } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(Payment) {}
