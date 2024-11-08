import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponseDto,
} from './dto/transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAllTransactions(
    @User() userId: string,
  ): Promise<TransactionResponseDto[]> {
    return await this.transactionsService.getAllTransactions(userId);
  }
  @Get('investment/:id')
  async getAllTransactionsForInvestmentId(
    @Param('id') investmentId: string,
    @User() user: string,
  ): Promise<TransactionResponseDto[]> {
    return await this.transactionsService.getAllTransactionsForInvestmentId(
      user,
      investmentId,
    );
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: string,
    @User() userId: string,
  ): Promise<TransactionResponseDto | null> {
    return await this.transactionsService.getTransactionById(id, userId);
  }
  @Post()
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @User() userId: string,
  ): Promise<TransactionResponseDto> {
    return await this.transactionsService.createTransaction(userId, data);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() data: UpdateTransactionDto,
    @User() userId: string,
  ): Promise<TransactionResponseDto> {
    return await this.transactionsService.updateTransaction(id, userId, data);
  }

  @Delete(':id')
  async deleteTransaction(
    @Param('id') id: string,
    @User() userId: string,
  ): Promise<Transaction> {
    return await this.transactionsService.deleteTransaction(id, userId);
  }
}
