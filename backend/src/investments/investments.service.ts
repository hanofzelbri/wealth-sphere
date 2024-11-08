import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Investment, Transaction, Staking, Storage } from '@prisma/client';
import { CreateInvestmentDto } from './dto/investment.dto';
import { CoingeckoService } from 'src/coingecko/coingecko.service';

export type InvestmentWithDetails = Investment & {
  transactions: Transaction[];
  stakings: Staking[];
  storages: Storage[];
};

@Injectable()
export class InvestmentsService {
  constructor(
    private prisma: PrismaService,
    private coingeckoService: CoingeckoService,
  ) {}

  async getAllInvestments(userId: string): Promise<InvestmentWithDetails[]> {
    try {
      return await this.prisma.getPrismaClient(userId).investment.findMany({
        where: { userId },
        include: {
          transactions: true,
          stakings: { include: { location: true } },
          storages: { include: { location: true } },
        },
      });
    } catch (error) {
      console.error('Error fetching all investments:', error);
      throw error;
    }
  }

  async getInvestmentById(
    id: string,
    userId: string,
  ): Promise<InvestmentWithDetails | null> {
    try {
      return await this.prisma.getPrismaClient(userId).investment.findUnique({
        where: { id, userId },
        include: {
          transactions: true,
          stakings: { include: { location: true } },
          storages: { include: { location: true } },
        },
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
          include: {
            transactions: true,
            stakings: { include: { location: true } },
            storages: { include: { location: true } },
          },
        });
    } catch (error) {
      console.error('Error fetching investment by symbol:', error);
      throw error;
    }
  }

  async createInvestment(
    data: CreateInvestmentDto,
    userId: string,
  ): Promise<InvestmentWithDetails> {
    try {
      const coinPrices = await this.coingeckoService.fetchCoinPrices([data.id]);
      const coinInfo = coinPrices[0];
      return await this.prisma.getPrismaClient(userId).investment.create({
        data: {
          coinId: data.id,
          name: coinInfo.name,
          symbol: coinInfo.symbol,
          image: coinInfo.image,
          currentPrice: coinInfo.current_price,
          userId,
        },
        include: {
          transactions: true,
          stakings: { include: { location: true } },
          storages: { include: { location: true } },
        },
      });
    } catch (error) {
      console.error('Error creating investment:', error);
      throw error;
    }
  }

  async deleteInvestment(
    id: string,
    userId: string,
  ): Promise<InvestmentWithDetails> {
    try {
      return await this.prisma.getPrismaClient(userId).investment.delete({
        where: { id, userId },
        include: {
          transactions: true,
          stakings: { include: { location: true } },
          storages: { include: { location: true } },
        },
      });
    } catch (error) {
      console.error('Error deleting investment:', error);
      throw error;
    }
  }
}
