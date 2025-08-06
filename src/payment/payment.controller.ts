import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: Payment) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get("payment_day/:date")
  payment_day(@Param("date") date: string) {
    return this.paymentService.payment_day(date);
  }

  @Get('debtor/:id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
