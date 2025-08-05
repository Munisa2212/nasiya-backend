import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { SellerModule } from './seller/seller.module';
import { DebterModule } from './debter/debter.module';
import { CreditModule } from './credit/credit.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [AdminModule, PrismaModule, SellerModule, DebterModule, CreditModule, PaymentModule, NotificationModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/file',
  }) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
