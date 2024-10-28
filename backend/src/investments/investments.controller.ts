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
import { InvestmentsService } from './investments.service';
import { Investment, Transaction, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';

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
  ): Promise<Investment | null> {
    return this.investmentsService.getInvestmentBySymbol(symbol, user);
  }

  @Post()
  async createInvestment(
    @Body() data: Prisma.InvestmentCreateInput,
    @User() user: string,
  ): Promise<Investment> {
    return this.investmentsService.createInvestment(data, user);
  }

  @Put(':id')
  async updateInvestment(
    @Param('id') id: string,
    @Body() data: Prisma.InvestmentUpdateInput,
    @User() user: string,
  ): Promise<Investment> {
    return this.investmentsService.updateInvestment(id, data, user);
  }

  @Delete(':id')
  async deleteInvestment(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<Investment> {
    return this.investmentsService.deleteInvestment(id, user);
  }

  @Post(':id/transactions')
  async addTransaction(
    @Param('id') id: string,
    @Body() transactionCreateInput: Prisma.TransactionCreateInput,
    @User() user: string,
  ): Promise<Transaction> {
    return this.investmentsService.addTransaction(
      id,
      transactionCreateInput,
      user,
    );
  }

  @Get('count')
  async getInvestmentCount(@User() user: string): Promise<number> {
    return this.investmentsService.getInvestmentCount(user);
  }

  @Get('best-performer')
  async getBestPerformer(@User() user: string): Promise<Investment | null> {
    return this.investmentsService.getBestPerformer(user);
  }

  @Get('worst-performer')
  async getWorstPerformer(@User() user: string): Promise<Investment | null> {
    return this.investmentsService.getWorstPerformer(user);
  }

  @Put(':id/transactions/:transactionId')
  async updateTransaction(
    @Param('id') id: string,
    @Param('transactionId') transactionId: string,
    @Body() transactionUpdateInput: Prisma.TransactionUpdateInput,
    @User() user: string,
  ) {
    return this.investmentsService.updateTransaction(
      id,
      transactionId,
      transactionUpdateInput,
      user,
    );
  }

  @Delete(':id/transactions/:transactionId')
  async deleteTransaction(
    @Param('id') id: string,
    @Param('transactionId') transactionId: string,
    @User() user: string,
  ) {
    return this.investmentsService.deleteTransaction(id, transactionId, user);
  }

  @Post(':id/storage')
  addStorage(
    @User() user: string,
    @Param('id') investmentId: string,
    @Body() storageData: any,
  ) {
    return this.investmentsService.addStorage(user, investmentId, storageData);
  }

  @Post(':id/staking')
  addStaking(
    @User() user: string,
    @Param('id') investmentId: string,
    @Body() stakingData: any,
  ) {
    return this.investmentsService.addStaking(user, investmentId, stakingData);
  }

  @Put('storage/:id')
  updateStorage(
    @User() user: string,
    @Param('id') storageId: string,
    @Body() storageData: any,
  ) {
    return this.investmentsService.updateStorage(user, storageId, storageData);
  }

  @Put('staking/:id')
  updateStaking(
    @User() user: string,
    @Param('id') stakingId: string,
    @Body() stakingData: any,
  ) {
    return this.investmentsService.updateStaking(user, stakingId, stakingData);
  }

  @Delete('storage/:id')
  deleteStorage(@User() user: string, @Param('id') storageId: string) {
    return this.investmentsService.deleteStorage(user, storageId);
  }

  @Delete('staking/:id')
  deleteStaking(@User() user: string, @Param('id') stakingId: string) {
    return this.investmentsService.deleteStaking(user, stakingId);
  }
}
