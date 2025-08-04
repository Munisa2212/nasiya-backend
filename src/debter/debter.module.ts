import { Module } from '@nestjs/common';
import { DebterService } from './debter.service';
import { DebterController } from './debter.controller';
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
  controllers: [DebterController],
  providers: [DebterService],
})
export class DebterModule {}
