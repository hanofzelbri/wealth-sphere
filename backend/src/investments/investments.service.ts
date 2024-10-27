import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Investment,
  Transaction,
  Prisma,
  Staking,
  Storage,
} from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

type InvestmentWithTransactions = Investment & {
  transactions: Transaction[];
};

type InvestmentWithDetails = Investment & {
  transactions: Transaction[];
  stakings: Staking[];
  storages: Storage[];
};

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async getAllInvestments(
    userId: string,
  ): Promise<InvestmentWithTransactions[]> {
    try {
      return await this.prisma.getPrismaClient(userId).investment.findMany({
        where: { userId },
        include: { transactions: true },
      });
    } catch (error) {
      console.error('Error fetching all investments:', error);
      throw error;
    }
  }

  async getInvestmentById(
    id: string,
    userId: string,
  ): Promise<InvestmentWithTransactions | null> {
    try {
      return await this.prisma.getPrismaClient(userId).investment.findUnique({
        where: { id, userId },
        include: { transactions: true },
      });
    } catch (error) {
      console.error('Error fetching investment by ID:', error);
      throw error;
    }
  }

  async getInvestmentBySymbol(
    symbol: string,
    userId: string,
  ): Promise<InvestmentWithDetails | null> {
    try {
      return await this.prisma
        .getPrismaClient(userId)
        .investment.findFirstOrThrow({
          where: { symbol, userId },
          include: { transactions: true, stakings: true, storages: true },
        });
    } catch (error) {
      console.error('Error fetching investment by symbol:', error);
      throw error;
    }
  }

  async createInvestment(
    data: Prisma.InvestmentCreateInput,
    userId: string,
  ): Promise<InvestmentWithTransactions> {
    try {
      const { transactions, ...investmentData } = data;
      return await this.prisma.getPrismaClient(userId).investment.create({
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
    } catch (error) {
      console.error('Error creating investment:', error);
      throw error;
    }
  }

  async updateInvestment(
    id: string,
    data: Prisma.InvestmentUpdateInput,
    userId: string,
  ): Promise<InvestmentWithTransactions> {
    try {
      const { transactions, ...investmentData } = data;
      return await this.prisma.getPrismaClient(userId).investment.update({
        where: { id, userId },
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
    } catch (error) {
      console.error('Error updating investment:', error);
      throw error;
    }
  }

  async deleteInvestment(
    id: string,
    userId: string,
  ): Promise<InvestmentWithTransactions> {
    try {
      return await this.prisma.getPrismaClient(userId).investment.delete({
        where: { id, userId },
        include: { transactions: true },
      });
    } catch (error) {
      console.error('Error deleting investment:', error);
      throw error;
    }
  }

  async getInvestmentCount(userId: string): Promise<number> {
    try {
      return await this.prisma.getPrismaClient(userId).investment.count({
        where: { userId },
      });
    } catch (error) {
      console.error('Error getting investment count:', error);
      throw error;
    }
  }

  async getBestPerformer(
    userId: string,
  ): Promise<InvestmentWithTransactions | null> {
    try {
      const investments = await this.getAllInvestments(userId);
      return investments.reduce((best, current) => {
        const bestPerformance = this.calculatePerformance(best);
        const currentPerformance = this.calculatePerformance(current);
        return currentPerformance > bestPerformance ? current : best;
      });
    } catch (error) {
      console.error('Error getting best performer:', error);
      throw error;
    }
  }

  async getWorstPerformer(
    userId: string,
  ): Promise<InvestmentWithTransactions | null> {
    try {
      const investments = await this.getAllInvestments(userId);
      return investments.reduce((worst, current) => {
        const worstPerformance = this.calculatePerformance(worst);
        const currentPerformance = this.calculatePerformance(current);
        return currentPerformance < worstPerformance ? current : worst;
      });
    } catch (error) {
      console.error('Error getting worst performer:', error);
      throw error;
    }
  }

  private calculatePerformance(investment: InvestmentWithTransactions): number {
    try {
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
    } catch (error) {
      console.error('Error calculating performance:', error);
      throw error;
    }
  }

  async addTransaction(
    id: string,
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    try {
      const investment = await this.prisma
        .getPrismaClient(userId)
        .investment.findUnique({
          where: { id, userId },
        });

      if (!investment) {
        throw new NotFoundException(
          `Investment with ID ${id} not found for this user`,
        );
      }

      return await this.prisma.getPrismaClient(userId).transaction.create({
        data: {
          ...createTransactionDto,
          investment: { connect: { id, userId } },
        },
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async updateTransaction(
    id: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    try {
      const investment = await this.prisma
        .getPrismaClient(userId)
        .investment.findUnique({
          where: { id, userId },
        });
      if (!investment) {
        throw new NotFoundException(
          `Investment with ID ${id} not found for this user`,
        );
      }

      return await this.prisma.getPrismaClient(userId).transaction.update({
        where: { id: transactionId, investment: { userId } },
        data: updateTransactionDto,
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string, transactionId: string, userId: string) {
    try {
      const investment = await this.prisma
        .getPrismaClient(userId)
        .investment.findUnique({
          where: { id, userId },
        });
      if (!investment) {
        throw new NotFoundException(
          `Investment with ID ${id} not found for this user`,
        );
      }

      return await this.prisma.getPrismaClient(userId).transaction.delete({
        where: { id: transactionId, investment: { userId } },
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async addStorage(userId: string, investmentId: string, storageData: any) {
    try {
      const prisma = this.prisma.getPrismaClient(userId);
      return await prisma.storage.create({
        data: {
          ...storageData,
          investmentId,
        },
      });
    } catch (error) {
      console.error('Error adding storage:', error);
      throw error;
    }
  }

  async addStaking(userId: string, investmentId: string, stakingData: any) {
    try {
      const prisma = this.prisma.getPrismaClient(userId);
      return await prisma.staking.create({
        data: {
          ...stakingData,
          investmentId,
        },
      });
    } catch (error) {
      console.error('Error adding staking:', error);
      throw error;
    }
  }

  async updateStorage(userId: string, storageId: string, storageData: any) {
    try {
      const prisma = this.prisma.getPrismaClient(userId);
      return await prisma.storage.update({
        where: { id: storageId },
        data: storageData,
      });
    } catch (error) {
      console.error('Error updating storage:', error);
      throw error;
    }
  }

  async updateStaking(userId: string, stakingId: string, stakingData: any) {
    try {
      const prisma = this.prisma.getPrismaClient(userId);
      return await prisma.staking.update({
        where: { id: stakingId },
        data: stakingData,
      });
    } catch (error) {
      console.error('Error updating staking:', error);
      throw error;
    }
  }

  async deleteStorage(userId: string, storageId: string) {
    try {
      const prisma = this.prisma.getPrismaClient(userId);
      return await prisma.storage.delete({
        where: { id: storageId },
      });
    } catch (error) {
      console.error('Error deleting storage:', error);
      throw error;
    }
  }

  async deleteStaking(userId: string, stakingId: string) {
    try {
      const prisma = this.prisma.getPrismaClient(userId);
      return await prisma.staking.delete({
        where: { id: stakingId },
      });
    } catch (error) {
      console.error('Error deleting staking:', error);
      throw error;
    }
  }
}
