import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Post()
  create(@Body() createCreditDto: CreateCreditDto) {
    return this.creditService.create(createCreditDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.creditService.findAll(req);
  }

  @Get("credit_schedule/:id")
  credit_schedule(@Param('id') id: string) {
    return this.creditService.credit_schedule(+id);
  }

  @Get("paid_month/:id")
  paid_month(@Param('id') id: string) {
    return this.creditService.paid_month(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditDto: UpdateCreditDto) {
    return this.creditService.update(+id, updateCreditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditService.remove(+id);
  }
}
