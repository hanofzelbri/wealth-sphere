import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction } from '@prisma/client';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getAllTransactions(userId: string): Promise<Transaction[]> {
    return await this.prisma.getPrismaClient(userId).transaction.findMany();
  }

  async getTransactionById(
    id: string,
    userId: string,
  ): Promise<Transaction | null> {
    return await this.prisma.getPrismaClient(userId).transaction.findUnique({
      where: { id },
    });
  }

  async createTransaction(
    data: CreateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    try {
      return await this.prisma.getPrismaClient(userId).transaction.create({
        data,
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async updateTransaction(
    id: string,
    data: UpdateTransactionDto,
    userId: string,
  ) {
    try {
      return await this.prisma.getPrismaClient(userId).transaction.update({
        where: { id },
        data: {
          ...(data.quantity && { quantity: data.quantity }),
          ...(data.price && { price: data.price }),
          ...(data.date && { date: data.date }),
          ...(data.type && { type: data.type }),
        },
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(transactionId: string, userId: string) {
    try {
      return await this.prisma.getPrismaClient(userId).transaction.delete({
        where: { id: transactionId, investment: { userId } },
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
}
