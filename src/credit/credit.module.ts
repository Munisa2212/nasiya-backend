import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
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
  controllers: [CreditController],
  providers: [CreditService],
})
export class CreditModule {}
