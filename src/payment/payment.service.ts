import { BadRequestException, Injectable } from '@nestjs/common';
import {  Payment } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {

  constructor(private readonly prisma: PrismaService) {}
  async create(createPaymentDto: Payment) {
  try {
    await this.prisma.$transaction(async (tx) => {
      const credit = await tx.credits.findUnique({
        where: { id: createPaymentDto.credit_id },
      });

      if (!credit) {
        throw new BadRequestException('Credit not found');
      }

      let amount = createPaymentDto.amount;

      for (const date of createPaymentDto.data) {
        if (credit.remaining_amount <= 0) {
          await tx.credits.update({
            where: { id: createPaymentDto.credit_id },
            data: { status: 'COMPLETED' },
          });
          throw new BadRequestException('Remaining amount is 0');
        }

        if (amount <= 0) {
          break; // Exit early if no amount left
        }

        const paymentSchedule = await tx.payment_schedule.findUnique({
          where: {
            credit_id_due_date: {
              credit_id: createPaymentDto.credit_id,
              due_date: new Date(date),
            },
          },
        });

        if (!paymentSchedule) {
          continue; // Skip if schedule not found
        }

        if (paymentSchedule.status === 'PAID') {
          continue; // Skip already paid
        }

        const remainingToPay = paymentSchedule.expected_amount - paymentSchedule.paid_amount;

        const paymentThisMonth = Math.min(remainingToPay, amount);

        await tx.payment_schedule.update({
          where: {
            credit_id_due_date: {
              credit_id: createPaymentDto.credit_id,
              due_date: new Date(date),
            },
          },
          data: {
            paid_amount: {
              increment: paymentThisMonth,
            },
          },
        });

        await tx.credits.update({
          where: { id: createPaymentDto.credit_id },
          data: {
            remaining_amount: {
              decrement: paymentThisMonth,
            },
          },
        });

        amount -= paymentThisMonth;

        const updatedSchedule = await tx.payment_schedule.findUnique({
          where: {
            credit_id_due_date: {
              credit_id: createPaymentDto.credit_id,
              due_date: new Date(date),
            },
          },
        });

        if (
          updatedSchedule &&
          updatedSchedule.paid_amount >= updatedSchedule.expected_amount
        ) {
          await tx.payment_schedule.update({
            where: {
              credit_id_due_date: {
                credit_id: createPaymentDto.credit_id,
                due_date: new Date(date),
              },
            },
            data: {
              status: 'PAID',
            },
          });
        }
      }

      // If credit remaining amount is now 0, mark credit as completed
      const updatedCredit = await tx.credits.findUnique({
        where: { id: createPaymentDto.credit_id },
      });

      if (updatedCredit && updatedCredit.remaining_amount <= 0) {
        await tx.credits.update({
          where: { id: createPaymentDto.credit_id },
          data: {
            status: 'COMPLETED',
          },
        });
      }
    });

    return { message: 'Payment made successfully' };
  } catch (error) {
    throw new BadRequestException(error.message || 'Transaction failed');
  }
}

  async payment_day(date: string) {
    try {
      const parsedDate = new Date(date);
      const year = parsedDate.getUTCFullYear();
      const month = parsedDate.getUTCMonth();
      const startDate = new Date(Date.UTC(year, month, 1));
      const endDate = new Date(Date.UTC(year, month + 1, 1));
      const month_debt = await this.prisma.payment_schedule.findMany({
      where: {
        due_date: {
          gte: startDate,
          lt: endDate,
        },
        status: "PENDING",
      },
      include: {
        credit: true,
      },
    });
      const data = await this.prisma.payment_schedule.findMany({
        where: { due_date: new Date(date) },
        include: { credit: true },
      });

      const debtorIds = data.map((item) => item.credit.debtor_id);

      const debtor = await this.prisma.debtor.findMany({
        where: {
          id: { in: debtorIds },
        },
        select: {
          id: true,
          name: true,
        }
      });

      data.forEach((item) => {
        const debtorName = debtor.find((debtor) => debtor.id === item.credit.debtor_id)?.name;
        if (debtorName) {
          item.credit[debtorName] = debtorName;
        }
      })
      return {month_debt, data}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async findOne(id: number) {
    try {
      const data = await this.prisma.payment.findMany()
      if(!data){
        throw new BadRequestException('Payment not found');
      }
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const data = await this.prisma.payment.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Payment not found');
      }
      await this.prisma.payment.update({where: {id}, data: updatePaymentDto});
      return {message: 'Payment updated successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.payment.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Payment not found');
      }
      await this.prisma.payment.delete({where: {id}});
      return {message: 'Payment deleted successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
