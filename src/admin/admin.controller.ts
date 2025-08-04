import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Add_admin, Admin_login } from './dto/create-admin.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("add")
  add_admin(@Body() Add_admin: Add_admin) {
    return this.adminService.add_admin(Add_admin);
  }

  @Post("login")
  login(@Body() Admin_login: Admin_login) {
    return this.adminService.login(Admin_login);
  }


  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
