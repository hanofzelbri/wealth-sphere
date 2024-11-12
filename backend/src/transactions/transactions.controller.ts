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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import {
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { TransactionEntity } from '../entities/transaction.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of transactions',
    type: [TransactionEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllTransactions(@User() userId: string) {
    return await this.transactionsService.getAllTransactions(userId);
  }

  @Get('investment/:id')
  @ApiOkResponse({
    description: 'List of transactions for investment',
    type: [TransactionEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllTransactionsForInvestmentId(
    @Param('id') investmentId: string,
    @User() user: string,
  ) {
    return await this.transactionsService.getAllTransactionsForInvestmentId(
      user,
      investmentId,
    );
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Transaction created successfully',
    type: TransactionEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @User() userId: string,
  ) {
    return await this.transactionsService.createTransaction(userId, data);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Transaction',
    type: TransactionEntity,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTransactionById(@Param('id') id: string, @User() userId: string) {
    return await this.transactionsService.getTransactionById(id, userId);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Transaction updated successfully',
    type: TransactionEntity,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateTransaction(
    @Param('id') id: string,
    @Body() data: UpdateTransactionDto,
    @User() userId: string,
  ) {
    return await this.transactionsService.updateTransaction(id, userId, data);
  }

  @Delete(':id')
  @ApiResponse({
    description: 'Transaction deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteTransaction(@Param('id') id: string, @User() userId: string) {
    await this.transactionsService.deleteTransaction(id, userId);
  }
}
