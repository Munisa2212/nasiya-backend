import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import dayjs from 'dayjs';

@Injectable()
export class CreditService {

  constructor(readonly prisma: PrismaService) {}
  async create(createCreditDto: CreateCreditDto) {
    try {
      const debtor = await this.prisma.debtor.findUnique({
        where: { id: createCreditDto.debtor_id },
      });

      if (!debtor) {
        throw new BadRequestException('Debtor not found');
      }
      const monthly_payment_amount = createCreditDto.total_amount / createCreditDto.duration;
      const credit = await this.prisma.credits.create({data: {
        ...createCreditDto,
        monthly_payment_amount,
        remaining_amount: createCreditDto.total_amount,
        status: "ACTIVE"
      }});

      for (let i = 0; i < createCreditDto.duration; i++) {
        const baseDate = new Date(credit.start_date);
        
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth() + i;
        const day = baseDate.getDate();

        const tentativeDate = new Date(year, month, day);

        if (tentativeDate.getDate() !== day) {
          tentativeDate.setDate(0);
        }

        const formatted = tentativeDate.toISOString().split('T')[0];

        await this.prisma.payment_schedule.create({
          data: {
            credit_id: credit.id,
            due_date: new Date(formatted),
            expected_amount: monthly_payment_amount,
            paid_amount: 0,
          },
        });
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
        },
        credit_image: true
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
