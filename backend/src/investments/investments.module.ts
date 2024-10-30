import { Module } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CoingeckoModule } from 'src/coingecko/coingecko.module';

@Module({
  imports: [CoingeckoModule],
  providers: [InvestmentsService, PrismaService],
  controllers: [InvestmentsController],
})
export class InvestmentsModule {}
