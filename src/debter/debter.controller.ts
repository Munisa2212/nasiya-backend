import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { DebterService } from './debter.service';
import { Add_debtor } from './dto/create-debter.dto';
import { UpdateDebterDto } from './dto/update-debter.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { RbucGuard } from 'src/guards/rbuc.guard';
import { Roles } from 'src/decorators/rbuc.decorators';
import { rolesEnum } from 'src/enum/role.enum';
import { ApiQuery } from '@nestjs/swagger';

@Controller('debtor')
export class DebterController {
  constructor(private readonly debterService: DebterService) {}

  @Roles(rolesEnum.ADMIN, rolesEnum.SELLER)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() Add_debtor: Add_debtor, @Req() req: Request) {
    return this.debterService.create(Add_debtor, req);
  }


  @UseGuards(AuthGuard)
  @Get("credit/:id")
  debtor_credit(@Param('id') id: string) {
    return this.debterService.debtor_credit(+id);
  }

  @Roles(rolesEnum.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: "sort", required: false, type: String })
  findAll(@Req() req: Request, @Query('name') name: string, @Query('sort') sort: "asc" | "desc") {
    return this.debterService.findAll(req, name, sort);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebterDto: UpdateDebterDto) {
    return this.debterService.update(+id, updateDebterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debterService.remove(+id);
  }

}
