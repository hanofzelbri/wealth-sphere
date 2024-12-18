import { Controller, Get, Query, Param, UseGuards, Put } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { ChartDataEntity } from './chart-data.entity';

@Controller('coingecko')
@UseGuards(JwtAuthGuard)
export class CoingeckoController {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  @Get('market-chart')
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [ChartDataEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllMarketChartData(
    @User() userId: string,
    @Query('days') days: string,
  ) {
    return this.coingeckoService.getAllMarketChartData(userId, Number(days));
  }

  @Get('market-chart/:coinId')
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [ChartDataEntity],
  })
  @ApiResponse({ status: 404, description: 'Coin not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMarketChartData(
    @User() userId: string,
    @Param('coinId') coinId: string,
    @Query('days') days: number,
  ) {
    return this.coingeckoService.getMarketChartData(userId, coinId, days);
  }

  @Put('update-coin-prices')
  @ApiResponse({ status: 204, description: 'Coin prices updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateCoinPrices(@User() userId: string) {
    this.coingeckoService.storeCoinPrices(userId);
  }

  @Put('update-market-chart-data')
  @ApiResponse({
    status: 204,
    description: 'Market chart data updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateMarketChartData(@User() userId: string) {
    this.coingeckoService.storeMarketChartData(userId);
  }
}
