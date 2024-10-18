import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Investment, Transaction, Prisma } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

type InvestmentWithTransactions = Investment & { transactions: Transaction[] };

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async getAllInvestments(
    userId: string,
  ): Promise<InvestmentWithTransactions[]> {
    return this.prisma.investment.findMany({
      where: { userId },
      include: { transactions: true },
    });
  }

  async getInvestmentById(
    id: string,
    userId: string,
  ): Promise<InvestmentWithTransactions | null> {
    return this.prisma.investment.findUnique({
      where: { id, userId },
      include: { transactions: true },
    });
  }

  async getInvestmentBySymbol(
    symbol: string,
    userId: string,
  ): Promise<InvestmentWithTransactions | null> {
    return this.prisma.investment.findFirst({
      where: { symbol, userId },
      include: { transactions: true },
    });
  }

  async createInvestment(
    data: Prisma.InvestmentCreateInput,
    userId: string,
  ): Promise<Investment> {
    const { transactions, ...investmentData } = data;
    return this.prisma.investment.create({
      data: {
        ...investmentData,
        User: { connect: { id: userId } },
        transactions: transactions
          ? {
              create:
                transactions as Prisma.TransactionCreateWithoutInvestmentInput[],
            }
          : undefined,
      },
      include: { transactions: true },
    });
  }

  async updateInvestment(
    id: string,
    data: Prisma.InvestmentUpdateInput,
    userId: string,
  ): Promise<InvestmentWithTransactions> {
    return this.prisma.investment.update({
      where: { id, userId },
      data,
      include: { transactions: true },
    });
  }

  async deleteInvestment(
    id: string,
    userId: string,
  ): Promise<InvestmentWithTransactions> {
    return this.prisma.investment.delete({
      where: { id, userId },
      include: { transactions: true },
    });
  }

  async getInvestmentCount(userId: string): Promise<number> {
    return this.prisma.investment.count({
      where: { userId },
    });
  }

  async getBestPerformer(
    userId: string,
  ): Promise<InvestmentWithTransactions | null> {
    const investments = await this.getAllInvestments(userId);
    return investments.reduce((best, current) => {
      const bestPerformance = this.calculatePerformance(best);
      const currentPerformance = this.calculatePerformance(current);
      return currentPerformance > bestPerformance ? current : best;
    });
  }

  async getWorstPerformer(
    userId: string,
  ): Promise<InvestmentWithTransactions | null> {
    const investments = await this.getAllInvestments(userId);
    return investments.reduce((worst, current) => {
      const worstPerformance = this.calculatePerformance(worst);
      const currentPerformance = this.calculatePerformance(current);
      return currentPerformance < worstPerformance ? current : worst;
    });
  }

  private calculatePerformance(investment: InvestmentWithTransactions): number {
    const totalQuantity = investment.transactions.reduce(
      (sum, t) => sum + (t.type === 'buy' ? t.quantity : -t.quantity),
      0,
    );
    const currentValue = totalQuantity * investment.currentPrice;
    const costBasis = investment.transactions.reduce(
      (sum, t) => sum + (t.type === 'buy' ? t.quantity * t.price : 0),
      0,
    );
    return (currentValue - costBasis) / costBasis;
  }

  async addTransaction(
    id: string,
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const investment = await this.prisma.investment.findUnique({
      where: { id, userId },
    });

    if (!investment) {
      throw new NotFoundException(
        `Investment with ID ${id} not found for this user`,
      );
    }

    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        investment: { connect: { id, userId } },
      },
    });
  }

  async updateTransaction(
    id: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    const investment = await this.prisma.investment.findUnique({
      where: { id, userId },
    });
    if (!investment) {
      throw new NotFoundException(
        `Investment with ID ${id} not found for this user`,
      );
    }

    return this.prisma.transaction.update({
      where: { id: transactionId, investment: { userId } },
      data: updateTransactionDto,
    });
  }

  async deleteTransaction(id: string, transactionId: string, userId: string) {
    const investment = await this.prisma.investment.findUnique({
      where: { id, userId },
    });
    if (!investment) {
      throw new NotFoundException(
        `Investment with ID ${id} not found for this user`,
      );
    }

    return this.prisma.transaction.delete({
      where: { id: transactionId, investment: { userId } },
    });
  }
}
