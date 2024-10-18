import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Investment, Transaction, Prisma } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

type InvestmentWithTransactions = Investment & { transactions: Transaction[] };

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async getAllInvestments(): Promise<InvestmentWithTransactions[]> {
    return this.prisma.investment.findMany({
      include: { transactions: true },
    });
  }

  async getInvestmentById(
    id: string,
  ): Promise<InvestmentWithTransactions | null> {
    return this.prisma.investment.findUnique({
      where: { id },
      include: { transactions: true },
    });
  }

  async getInvestmentBySymbol(
    symbol: string,
  ): Promise<InvestmentWithTransactions | null> {
    return this.prisma.investment.findFirst({
      where: { symbol },
      include: { transactions: true },
    });
  }

  async createInvestment(
    data: Prisma.InvestmentCreateInput,
  ): Promise<InvestmentWithTransactions> {
    const { transactions, ...investmentData } = data;
    return this.prisma.investment.create({
      data: {
        ...investmentData,
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
  ): Promise<InvestmentWithTransactions> {
    return this.prisma.investment.update({
      where: { id },
      data,
      include: { transactions: true },
    });
  }

  async deleteInvestment(id: string): Promise<InvestmentWithTransactions> {
    return this.prisma.investment.delete({
      where: { id },
      include: { transactions: true },
    });
  }

  async getInvestmentCount(): Promise<number> {
    return this.prisma.investment.count();
  }

  async getBestPerformer(): Promise<InvestmentWithTransactions | null> {
    const investments = await this.getAllInvestments();
    return investments.reduce((best, current) => {
      const bestPerformance = this.calculatePerformance(best);
      const currentPerformance = this.calculatePerformance(current);
      return currentPerformance > bestPerformance ? current : best;
    });
  }

  async getWorstPerformer(): Promise<InvestmentWithTransactions | null> {
    const investments = await this.getAllInvestments();
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

  async createTransaction(
    investmentId: string,
    data: Omit<Prisma.TransactionCreateInput, 'investment'>,
  ): Promise<Transaction> {
    const investment = await this.prisma.investment.findUnique({
      where: { id: investmentId },
    });

    if (!investment) {
      throw new NotFoundException(
        `Investment with ID ${investmentId} not found`,
      );
    }

    return this.prisma.transaction.create({
      data: {
        ...data,
        investment: {
          connect: { id: investmentId },
        },
      },
    });
  }

  async addTransaction(id: string, createTransactionDto: CreateTransactionDto) {
    const investment = await this.prisma.investment.findUnique({
      where: { id },
    });
    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        investmentId: id,
      },
    });
  }

  async updateTransaction(
    id: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const investment = await this.prisma.investment.findUnique({
      where: { id },
    });
    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: updateTransactionDto,
    });
  }

  async deleteTransaction(id: string, transactionId: string) {
    const investment = await this.prisma.investment.findUnique({
      where: { id },
    });
    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    return this.prisma.transaction.delete({
      where: { id: transactionId },
    });
  }
}
