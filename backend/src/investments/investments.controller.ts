import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { Investment, Transaction, Prisma } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Request } from 'express';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  async getAllInvestments(@Req() req: Request): Promise<Investment[]> {
    return this.investmentsService.getAllInvestments(req['userId']);
  }

  @Get(':id')
  async getInvestmentById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Investment | null> {
    return this.investmentsService.getInvestmentById(id, req['userId']);
  }

  @Get('symbol/:symbol')
  async getInvestmentBySymbol(
    @Param('symbol') symbol: string,
    @Req() req: Request,
  ): Promise<Investment | null> {
    return this.investmentsService.getInvestmentBySymbol(symbol, req['userId']);
  }

  @Post()
  async createInvestment(
    @Body() data: Prisma.InvestmentCreateInput,
    @Req() req: Request,
  ): Promise<Investment> {
    return this.investmentsService.createInvestment(data, req['userId']);
  }

  @Put(':id')
  async updateInvestment(
    @Param('id') id: string,
    @Body() data: Prisma.InvestmentUpdateInput,
    @Req() req: Request,
  ): Promise<Investment> {
    return this.investmentsService.updateInvestment(id, data, req['userId']);
  }

  @Delete(':id')
  async deleteInvestment(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Investment> {
    return this.investmentsService.deleteInvestment(id, req['userId']);
  }

  @Post(':id/transactions')
  async addTransaction(
    @Param('id') id: string,
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ): Promise<Transaction> {
    return this.investmentsService.addTransaction(
      id,
      createTransactionDto,
      req['userId'],
    );
  }

  @Get('count')
  async getInvestmentCount(@Req() req: Request): Promise<number> {
    return this.investmentsService.getInvestmentCount(req['userId']);
  }

  @Get('best-performer')
  async getBestPerformer(@Req() req: Request): Promise<Investment | null> {
    return this.investmentsService.getBestPerformer(req['userId']);
  }

  @Get('worst-performer')
  async getWorstPerformer(@Req() req: Request): Promise<Investment | null> {
    return this.investmentsService.getWorstPerformer(req['userId']);
  }

  @Put(':id/transactions/:transactionId')
  async updateTransaction(
    @Param('id') id: string,
    @Param('transactionId') transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: Request,
  ) {
    return this.investmentsService.updateTransaction(
      id,
      transactionId,
      updateTransactionDto,
      req['userId'],
    );
  }

  @Delete(':id/transactions/:transactionId')
  async deleteTransaction(
    @Param('id') id: string,
    @Param('transactionId') transactionId: string,
    @Req() req: Request,
  ) {
    return this.investmentsService.deleteTransaction(
      id,
      transactionId,
      req['userId'],
    );
  }
}
