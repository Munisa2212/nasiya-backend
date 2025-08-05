import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Add_admin, Admin_login } from './dto/create-admin.dto';
import { rolesEnum } from 'src/enum/role.enum';
import { Request } from 'express';

@Injectable()
export class AdminService {

  constructor(readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async getTokens(userId: number) {
    const userRole = rolesEnum.ADMIN;
    const jwt = this.jwtService.sign({id: userId, role: userRole})
    return { access_token: jwt};
  }
  async add_admin(Add_admin: Add_admin) {
    try {
      const exist_admin = await this.prisma.admin.findFirst({where: {login: Add_admin.login}});
      if(exist_admin){
        throw new BadRequestException('Admin already exist');
      }
      const hash = bcrypt.hashSync(Add_admin.password, 10);
      await this.prisma.admin.create({data: {
        login: Add_admin.login,
        password: hash
      }});
      return {message: 'Admin created successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(Admin_login: Admin_login){
    try {
      const exist_admin = await this.prisma.admin.findFirst({where: {login: Admin_login.login}});
      if(!exist_admin){
        throw new BadRequestException('Admin not found. Please register first');
      }
      const check_password = bcrypt.compareSync(Admin_login.password, exist_admin.password);
      if(!check_password){
        throw new BadRequestException('Invalid password');
      }

      return this.getTokens(exist_admin.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async me(req: Request) {
    try {
      const id = req["user-id"]
      const data = await this.prisma.admin.findUnique({
        where: {id}
      });
      if(!data){
        throw new BadRequestException('Admin not found');
      }
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.admin.findMany();
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.admin.findUnique({where: {id}});
      if(!data){
        throw new BadRequestException('Admin not found');
      }
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const data = await this.prisma.admin.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Admin not found');
      }
      await this.prisma.admin.update({where: {id}, data: updateAdminDto});
      return {message: 'Admin updated successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.admin.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Admin not found');
      }
      await this.prisma.admin.delete({where: {id}});
      return {message: 'Admin deleted successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
