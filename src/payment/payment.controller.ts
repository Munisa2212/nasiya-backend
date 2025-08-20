import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Roles } from 'src/decorators/rbuc.decorators';
import { rolesEnum } from 'src/enum/role.enum';
import { RbucGuard } from 'src/guards/rbuc.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';


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

  @Roles(rolesEnum.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get('debtor')
  findOne( @Req() req: Request) {
    return this.paymentService.findOne( req);
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
