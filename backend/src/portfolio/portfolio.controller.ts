import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { PortfolioHistoryEntity } from 'src/entities/portfolio-history.entity';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('portfolio-history')
  @ApiResponse({
    status: 200,
    description: 'Portfolio history fetched successfully',
    type: [PortfolioHistoryEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPortfolioHistory(
    @User() userId: string,
    @Query('days') days: number,
  ): Promise<PortfolioHistoryEntity[]> {
    return this.portfolioService.getPortfolioHistory(userId, days);
  }
}
