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
    @User() user: string,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.getAllTransactions(user);
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<TransactionResponseDto | null> {
    return this.transactionsService.getTransactionById(id, user);
  }

  @Post()
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @User() user: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.createTransaction(data, user);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() data: UpdateTransactionDto,
    @User() user: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.updateTransaction(id, data, user);
  }

  @Delete(':id')
  async deleteTransaction(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<Transaction> {
    return this.transactionsService.deleteTransaction(id, user);
  }
}
