import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
          PrismaModule,
          JwtModule.register({
            secret: 'yourSecret',
            signOptions: { expiresIn: '1h' },
          }),
      ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
