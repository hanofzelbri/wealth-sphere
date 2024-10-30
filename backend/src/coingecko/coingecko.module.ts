import { Module } from '@nestjs/common';
import { CoingeckoController } from './coingecko.controller';
import { CoingeckoService } from './coingecko.service';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [],
  controllers: [CoingeckoController],
  providers: [CoingeckoService, ConfigService],
  exports: [CoingeckoService],
})
export class CoingeckoModule {}
