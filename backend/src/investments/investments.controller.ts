import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { Investment, Transaction, Prisma } from '@prisma/client';

@Controller('investments')
export class InvestmentsController {
  constructor(private investmentsService: InvestmentsService) {}

  @Get()
  async getAllInvestments(): Promise<Investment[]> {
    return this.investmentsService.getAllInvestments();
  }

  @Get(':id')
  async getInvestmentById(@Param('id') id: string): Promise<Investment | null> {
    return this.investmentsService.getInvestmentById(id);
  }

  @Get('symbol/:symbol')
  async getInvestmentBySymbol(
    @Param('symbol') symbol: string,
  ): Promise<Investment | null> {
    return this.investmentsService.getInvestmentBySymbol(symbol);
  }

  @Post()
  async createInvestment(
    @Body() data: Prisma.InvestmentCreateInput,
  ): Promise<Investment> {
    return this.investmentsService.createInvestment(data);
  }

  @Put(':id')
  async updateInvestment(
    @Param('id') id: string,
    @Body() data: Prisma.InvestmentUpdateInput,
  ): Promise<Investment> {
    return this.investmentsService.updateInvestment(id, data);
  }

  @Delete(':id')
  async deleteInvestment(@Param('id') id: string): Promise<Investment> {
    return this.investmentsService.deleteInvestment(id);
  }

  @Post(':id/transactions')
  async addTransaction(
    @Param('id') id: string,
    @Body() data: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return this.investmentsService.addTransaction(id, data);
  }

  @Get('count')
  async getInvestmentCount(): Promise<number> {
    return this.investmentsService.getInvestmentCount();
  }

  @Get('best-performer')
  async getBestPerformer(): Promise<Investment | null> {
    return this.investmentsService.getBestPerformer();
  }

  @Get('worst-performer')
  async getWorstPerformer(): Promise<Investment | null> {
    return this.investmentsService.getWorstPerformer();
  }
}
