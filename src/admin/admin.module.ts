import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
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
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
