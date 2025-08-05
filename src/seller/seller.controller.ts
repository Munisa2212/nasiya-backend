import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SellerService } from './seller.service';
import { Add_seller, Login_seller } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Roles } from 'src/decorators/rbuc.decorators';
import { rolesEnum } from 'src/enum/role.enum';
import { RbucGuard } from 'src/guards/rbuc.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Roles(rolesEnum.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post("add")
  add(@Body() Add_seller: Add_seller) {
    return this.sellerService.add(Add_seller);
  }

  @Post("login")
  login(@Body() Login_seller: Login_seller) {
    return this.sellerService.login(Login_seller);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  me(@Req() req: Request) {
    return this.sellerService.me(req);
  }

  @UseGuards(AuthGuard)
  @Get("myDebtors")
  myDebtors(@Req() req: Request) {
    return this.sellerService.myDebtors(req);
  }

  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }


}
