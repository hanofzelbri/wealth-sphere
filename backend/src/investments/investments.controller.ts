import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { CreateInvestmentDto } from './dto/investment.dto';
import { ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { InvestmentEntity } from 'src/entities/investment.entity';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Successful response',
    type: [InvestmentEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllInvestments(@User() user: string): Promise<InvestmentEntity[]> {
    return this.investmentsService.getAllInvestments(user);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Successful response',
    type: InvestmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getInvestmentById(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<InvestmentEntity> {
    return this.investmentsService.getInvestmentById(id, user);
  }

  @Get('symbol/:symbol')
  @ApiOkResponse({
    description: 'Successful response',
    type: InvestmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getInvestmentBySymbol(
    @Param('symbol') symbol: string,
    @User() user: string,
  ): Promise<InvestmentEntity> {
    return this.investmentsService.getInvestmentBySymbol(symbol, user);
  }

  @Post()
  @ApiOkResponse({
    description: 'Investment created successfully',
    type: InvestmentEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createInvestment(
    @Body() data: CreateInvestmentDto,
    @User() user: string,
  ): Promise<InvestmentEntity> {
    return this.investmentsService.createInvestment(data, user);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Investment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteInvestment(@Param('id') id: string, @User() user: string) {
    return this.investmentsService.deleteInvestment(id, user);
  }
}
