import { BadRequestException, Injectable } from '@nestjs/common';
import { Add_debtor } from './dto/create-debter.dto';
import { UpdateDebterDto } from './dto/update-debter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { rolesEnum } from 'src/enum/role.enum';

@Injectable()
export class DebterService {

  constructor(private readonly prisma: PrismaService) {}
  async create(Add_debtor: Add_debtor, req: Request) {
    try {
      let seller_id = req["user-id"]
      const data = await this.prisma.debtor.findFirst({where: {name: Add_debtor.name}});
      if(data){
        throw new BadRequestException('Debtor already exists');
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const debtor = await tx.debtor.create({
          data: {
            name: Add_debtor.name,
            address: Add_debtor.address,
            note: Add_debtor.note || 'note',
            seller_id,
          },
        });

        if (Add_debtor.phone.length > 0) {
          const phoneData = Add_debtor.phone.map((phone) => ({
            phone,
            debtor_id: debtor.id,
          }));

          await tx.debtor_phone.createMany({
            data: phoneData,
          });
        }

        if (Add_debtor.image.length > 0) {
          const imageData = Add_debtor.image.map((image) => ({
            image,
            debtor_id: debtor.id,
          }));

          await tx.debtor_image.createMany({
            data: imageData,
          });
      }

      return debtor;
    });

      return { message: 'Debtor created successfully', data: result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async debtor_credit(id: number){
    try {
      const data = await this.prisma.credits.findMany({where: {debtor_id: id}});
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(req: Request) {
    try {
      let seller_id = req["user-id"]
      let role = req["user-role"]
      if(role === rolesEnum.SELLER){
        const data = await this.prisma.debtor.findMany({
          where: {
            seller_id
          },
          include: {
          debtor_image: true,
          debtor_phone: true,
          credits: true
        }});

        return {data}
      }else if(role === rolesEnum.ADMIN){
        const data = await this.prisma.debtor.findMany({include: {
          debtor_image: true,
          debtor_phone: true,
          credits: {omit: {debtor_id: true, id: true}}
        }});

        return {data}
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.debtor.findUnique({where: {id}, include: {
        debtor_image: true,
        debtor_phone: true,
        credits:  true
      }})
      if(!data){
        throw new BadRequestException('Debtor not found');
      }
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateDebterDto: UpdateDebterDto) {
    try {
      const data = await this.prisma.debtor.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Debtor not found');
      }
      await this.prisma.debtor.update({where: {id}, data: updateDebterDto});
      return {message: 'Debtor updated successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.debtor.findFirst({ where: { id } });

      if (!data) {
        throw new BadRequestException('Debtor not found');
      }

      await this.prisma.debtor_image.deleteMany({ where: { debtor_id: id } });
      await this.prisma.debtor_phone.deleteMany({ where: { debtor_id: id } });

      await this.prisma.debtor.delete({ where: { id } });

      return { message: 'Debtor deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
