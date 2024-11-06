import { Controller, Get, Query, Param } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { CoinPrice, CoinMarketChart } from './interfaces';

@Controller('coingecko')
export class CoingeckoController {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  @Get('prices')
  async getPrices(
    @Query('coins') coins: string | string[],
  ): Promise<CoinPrice[]> {
    const coinIds = Array.isArray(coins) ? coins : [coins];
    return this.coingeckoService.getCoinPrices(coinIds);
  }

  @Get('chart/:coinId')
  async getMarketChart(
    @Param('coinId') coinId: string,
    @Query('days') days: number = 7,
  ): Promise<CoinMarketChart> {
    return this.coingeckoService.getCoinMarketChart(coinId, 'usd', days);
  }
}
