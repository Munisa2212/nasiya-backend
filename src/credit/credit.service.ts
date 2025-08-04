import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class CreditService {

  constructor(readonly prisma: PrismaService) {}
  async create(createCreditDto: CreateCreditDto) {
    try {
      const monthly_payment_amount = createCreditDto.total_amount / createCreditDto.duration;
      const credit = await this.prisma.credits.create({data: {
        ...createCreditDto,
        monthly_payment_amount,
        remaining_amount: createCreditDto.total_amount,
        status: "ACTIVE"
      }});

      for(let i=0; i < createCreditDto.duration; i++){
        const paymentDate = new Date(credit.start_date);
        paymentDate.setMonth(paymentDate.getMonth() + i);
        const data = await this.prisma.payment_schedule.create({data: {
          credit_id: credit.id,
          due_date: paymentDate,
          expected_amount: monthly_payment_amount,
          paid_amount: 0
        }});
      }

      return credit
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async credit_schedule(id: number){
    try {
      const data = await this.prisma.payment_schedule.findMany({where: {credit_id: id, status: 'PENDING'}, select: {id: true, due_date: true, expected_amount: true, status: true, paid_amount: true}});
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paid_month(id: number){
    try {
      const data = await this.prisma.payment_schedule.findMany({where: {credit_id: id, status: "PAID"}});
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  
  async findAll(req: Request) {
    try {
      const id = req["user-id"]
      const debtor = await this.prisma.debtor.findMany({where: {seller_id: id}, select: {id: true}});
      const data = await this.prisma.credits.findMany({
        include: {
          debtor: {
            select: {name: true}
          }
        },
        where: {
          debtor_id: {
            in: debtor.map((debtor) => debtor.id)
          }
        }
      });
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.credits.findFirst({where: {id}, include: {
        debtor: {
          select: {name: true}
        }
      }});
      if(!data){
        throw new BadRequestException('Credit not found');
      }
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateCreditDto: UpdateCreditDto) {
    try {
      const data = await this.prisma.credits.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Credit not found');
      }
      await this.prisma.credits.update({where: {id}, data: updateCreditDto});
      return {message: 'Credit updated successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.credits.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Credit not found');
      }
      await this.prisma.credits.delete({where: {id}});
      return {message: 'Credit deleted successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
