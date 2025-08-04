import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
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
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
