import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Add_admin, Admin_login } from './dto/create-admin.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { Roles } from 'src/decorators/rbuc.decorators';
import { rolesEnum } from 'src/enum/role.enum';
import { RbucGuard } from 'src/guards/rbuc.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(rolesEnum.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post("add")
  add_admin(@Body() Add_admin: Add_admin) {
    return this.adminService.add_admin(Add_admin);
  }

  @Post("login")
  login(@Body() Admin_login: Admin_login) {
    return this.adminService.login(Admin_login);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  me(@Req() req: Request) {
    return this.adminService.me(req);
  }

  @Roles(rolesEnum.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Roles(rolesEnum.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Roles(rolesEnum.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Roles(rolesEnum.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
