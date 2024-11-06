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
  mapTransactionType,
} from './dto/transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAllTransactions(
    @User() user: string,
  ): Promise<TransactionResponseDto[]> {
    const ret = await this.transactionsService.getAllTransactions(user);

    return ret.map((transaction) => ({
      ...transaction,
      type: mapTransactionType(transaction.type),
    }));
  }
  @Get('investment/:id')
  async getAllTransactionsForInvestmentId(
    @Param('id') investmentId: string,
    @User() user: string,
  ): Promise<TransactionResponseDto[]> {
    const ret =
      await this.transactionsService.getAllTransactionsForInvestmentId(
        user,
        investmentId,
      );

    console.log(ret);

    return ret.map((transaction) => ({
      ...transaction,
      type: mapTransactionType(transaction.type),
    }));
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<TransactionResponseDto | null> {
    const transaction = await this.transactionsService.getTransactionById(
      id,
      user,
    );

    return {
      ...transaction,
      type: mapTransactionType(transaction.type),
    };
  }

  @Post()
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @User() user: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.createTransaction(
      data,
      user,
    );

    return { ...transaction, type: mapTransactionType(transaction.type) };
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() data: UpdateTransactionDto,
    @User() user: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.updateTransaction(
      id,
      data,
      user,
    );

    return { ...transaction, type: mapTransactionType(transaction.type) };
  }

  @Delete(':id')
  async deleteTransaction(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionsService.deleteTransaction(
      id,
      user,
    );

    return { ...transaction, type: mapTransactionType(transaction.type) };
  }
}
