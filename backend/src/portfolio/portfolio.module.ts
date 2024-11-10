import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { CoingeckoModule } from 'src/coingecko/coingecko.module';
import { InvestmentsModule } from 'src/investments/investments.module';

@Module({
  imports: [CoingeckoModule, InvestmentsModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
