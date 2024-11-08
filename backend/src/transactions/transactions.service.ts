import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getAllTransactions(userId: string): Promise<Transaction[]> {
    return await this.prisma
      .getPrismaClient(userId)
      .transaction.findMany({ where: { userId } });
  }
  async getAllTransactionsForInvestmentId(
    userId: string,
    investmentId: string,
  ): Promise<Transaction[]> {
    return await this.prisma.getPrismaClient(userId).transaction.findMany({
      where: { AND: { userId, investmentId } },
    });
  }

  async getTransactionById(
    id: string,
    userId: string,
  ): Promise<Transaction | null> {
    return await this.prisma.getPrismaClient(userId).transaction.findUnique({
      where: { id, userId },
    });
  }

  async createTransaction(userId: string, data: any): Promise<Transaction> {
    try {
      return await this.prisma.getPrismaClient(userId).transaction.create({
        data: { ...data, userId },
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id: string, userId: string, data: any) {
    try {
      return await this.prisma.getPrismaClient(userId).transaction.update({
        where: { id, userId },
        data: { ...data, userId },
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string, userId: string) {
    try {
      return await this.prisma.getPrismaClient(userId).transaction.delete({
        where: { id, userId },
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
}
