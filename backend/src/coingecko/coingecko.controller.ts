import { Controller, Get, Query, Param, Post, UseGuards } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { User } from 'src/decorators/user.decorator';
import { MarketData } from './dto/coingecko.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('coingecko')
export class CoingeckoController {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  @Get('market-chart')
  @UseGuards(JwtAuthGuard)
  async getAllMarketChartData(
    @User('id') userId: string,
    @Query('days') days: string,
  ): Promise<MarketData[]> {
    return this.coingeckoService.getAllMarketChartData(userId, Number(days));
  }

  @Get('market-chart/:coinId')
  async getMarketChartData(
    @Param('coinId') coinId: string,
    @Query('days') days: number,
  ): Promise<MarketData> {
    return this.coingeckoService.getMarketChartData(coinId, 'usd', days);
  }

  @Post('update-coin-prices')
  async updateCoinPrices(@User() userId: string) {
    this.coingeckoService.storeCoinPrices(userId);
  }

  @Post('update-market-chart-data')
  async updateMarketChartData(@User() userId: string) {
    this.coingeckoService.storeMarketChartData(userId);
  }
}
