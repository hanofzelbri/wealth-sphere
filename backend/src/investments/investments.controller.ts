import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  InvestmentsService,
  InvestmentWithDetails,
} from './investments.service';
import { Investment } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { CreateInvestmentDto } from './dto/investment.dto';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  async getAllInvestments(@User() user: string): Promise<Investment[]> {
    return this.investmentsService.getAllInvestments(user);
  }

  @Get(':id')
  async getInvestmentById(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<Investment | null> {
    return this.investmentsService.getInvestmentById(id, user);
  }

  @Get('symbol/:symbol')
  async getInvestmentBySymbol(
    @Param('symbol') symbol: string,
    @User() user: string,
  ): Promise<InvestmentWithDetails | null> {
    return this.investmentsService.getInvestmentBySymbol(symbol, user);
  }

  @Post()
  async createInvestment(
    @Body() data: CreateInvestmentDto,
    @User() user: string,
  ): Promise<Investment> {
    return this.investmentsService.createInvestment(data, user);
  }

  @Delete(':id')
  async deleteInvestment(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<Investment> {
    return this.investmentsService.deleteInvestment(id, user);
  }
}
