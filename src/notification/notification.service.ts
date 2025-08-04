import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {

  constructor(readonly prisma: PrismaService) {}
  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const data = await this.prisma.notification.create({data: {
        ...createNotificationDto,
        sent_at: new Date(),
        status: 'SENT'
      }});
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneByDebtorId(id: number){
    try {
      const data = await this.prisma.notification.findMany({where: {client_id: id}});
      if(!data){
        throw new BadRequestException('Notification not found');
      }
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    try {
      const data = await this.prisma.notification.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Notification not found');
      }
      await this.prisma.notification.update({where: {id}, data: updateNotificationDto});
      return {message: 'Notification updated successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.notification.findFirst({where: {id}});
      if(!data){
        throw new BadRequestException('Notification not found');
      }
      await this.prisma.notification.delete({where: {id}});
      return {message: 'Notification deleted successfully'}
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
