import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { rolesEnum } from 'src/enum/role.enum';
import { Roles } from 'src/decorators/rbuc.decorators';
import { RbucGuard } from 'src/guards/rbuc.guard';

@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Roles(rolesEnum.ADMIN, rolesEnum.SELLER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCreditDto: CreateCreditDto) {
    return this.creditService.create(createCreditDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.creditService.findAll(req);
  }

  @Roles(rolesEnum.ADMIN, rolesEnum.SELLER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get("credit_schedule/:id")
  credit_schedule(@Param('id') id: string) {
    return this.creditService.credit_schedule(+id);
  }


  @UseGuards(AuthGuard)
  @Get("paid_month/:id")
  paid_month(@Param('id') id: string) {
    return this.creditService.paid_month(+id);
  }


  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditDto: UpdateCreditDto) {
    return this.creditService.update(+id, updateCreditDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditService.remove(+id);
  }
}
