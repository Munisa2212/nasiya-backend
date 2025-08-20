import { BadRequestException, Injectable } from '@nestjs/common';
import { Add_seller, Login_seller } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { rolesEnum } from 'src/enum/role.enum';
import { Request } from 'express';

@Injectable()
export class SellerService {

  constructor(readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async getTokens(userId: number) {
    const userRole = rolesEnum.ADMIN;
    const jwt = this.jwtService.sign({id: userId, role: userRole})
    return { access_token: jwt};
  }
  async add(Add_seller: Add_seller) {
    try {
      const exist_seller = await this.prisma.seller.findFirst({where: {login: Add_seller.login}});
      if(exist_seller){
        throw new BadRequestException('Seller already exist');
      }
      const hash = bcrypt.hashSync(Add_seller.password, 10);
      await this.prisma.seller.create({data: {
        name: Add_seller.name,
        login: Add_seller.login,
        password: hash,
        image: Add_seller.image,
        balance: 0
      }});
      return {message: 'Seller created successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(Login_seller:Login_seller){
    try {
      const exist_seller = await this.prisma.seller.findFirst({where: {login: Login_seller.login}});
      if(!exist_seller){
        throw new BadRequestException("Seller not found. Please register first");
      }
      const check_password = bcrypt.compareSync(Login_seller.password, exist_seller.password);
      if(!check_password){
        throw new BadRequestException('Invalid password');
      }

      return this.getTokens(exist_seller.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async me(req: Request) {
    try {
      const id = req["user-id"]
      const data = await this.prisma.seller.findUnique({where: {id}, include: {debters: true}});
      if(!data){
        throw new BadRequestException('Seller not found');
      }
      const debtors_id = await this.prisma.debtor.findMany({where: {seller_id: id}, select: {id: true}});
      const total_debt = await this.prisma.credits.aggregate({
        _sum: {
          remaining_amount: true
        },
        where: {
          debtor_id: {
            in: debtors_id.map((debtor) => debtor.id)
          }
        }
      })



      return {data, total_debt: total_debt._sum.remaining_amount || 0, debtors_count: debtors_id.length}
      
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async myDebtors(req: Request){
    try {
      const id = req["user-id"]
      const data = await this.prisma.debtor.findMany({where: {seller_id: id}, include: {
        debtor_image: { select: { image: true } },
        debtor_phone: { select: { phone: true } },
        credits: {omit: {debtor_id: true, id: true }}
      }});
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.seller.findMany();
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.seller.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Seller not found');
      }
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    try {
      const data = await this.prisma.seller.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Seller not found');
      }
      await this.prisma.seller.update({where: {id}, data: updateSellerDto});
      return {message: 'Seller updated successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.seller.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Seller not found');
      }
      await this.prisma.seller.delete({where: {id}});
      return {message: 'Seller deleted successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
