import { Controller, Get, Query, Param, Post, UseGuards } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';

@Controller('coingecko')
export class CoingeckoController {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  @Get('market-chart')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllMarketChartData(
    @User('id') userId: string,
    @Query('days') days: string,
  ) {
    return this.coingeckoService.getAllMarketChartData(userId, Number(days));
  }

  @Get('market-chart/:coinId')
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @ApiResponse({ status: 404, description: 'Coin not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMarketChartData(
    @Param('coinId') coinId: string,
    @Query('days') days: number,
  ) {
    return this.coingeckoService.getMarketChartData(coinId, 'usd', days);
  }

  @Post('update-coin-prices')
  @ApiResponse({ status: 200, description: 'Coin prices updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateCoinPrices(@User() userId: string) {
    this.coingeckoService.storeCoinPrices(userId);
  }

  @Post('update-market-chart-data')
  @ApiResponse({
    status: 200,
    description: 'Market chart data updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateMarketChartData(@User() userId: string) {
    this.coingeckoService.storeMarketChartData(userId);
  }
}
