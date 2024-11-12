import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { CoingeckoModule } from 'src/coingecko/coingecko.module';
import { InvestmentsModule } from 'src/investments/investments.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [CoingeckoModule, InvestmentsModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, PrismaService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
