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
        include: { transactions: true, stakings: true, storages: true },
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
        include: { transactions: true, stakings: true, storages: true },
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
      const coinPrices = await this.coingeckoService.getCoinPrices([data.id]);
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
        include: { transactions: true, stakings: true, storages: true },
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
        include: { transactions: true, stakings: true, storages: true },
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
  ): Promise<InvestmentWithDetails | null> {
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
  ): Promise<InvestmentWithDetails | null> {
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

  private calculatePerformance(investment: InvestmentWithDetails): number {
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

  async updateInvestmentInfo(userId: string): Promise<InvestmentWithDetails[]> {
    try {
      // Get all investments for the user
      const investments = await this.prisma
        .getPrismaClient(userId)
        .investment.findMany({
          where: {
            userId,
          },
          include: { transactions: true, stakings: true, storages: true },
        });

      // Get all unique coin IDs
      const coinIds = [...new Set(investments.map((inv) => inv.coinId))];

      // Get prices for all coins
      const coinPrices = await this.coingeckoService.getCoinPrices(coinIds);

      // Update each investment with its corresponding coin price info
      const updates = investments.map(async (inv) => {
        const coinInfo = coinPrices.find((coin) => coin.id === inv.coinId);
        if (!coinInfo) return inv;

        return this.prisma.getPrismaClient(userId).investment.update({
          where: { id: inv.id, userId },
          data: {
            name: coinInfo.name,
            symbol: coinInfo.symbol,
            image: coinInfo.image,
            currentPrice: coinInfo.current_price,
          },
          include: { transactions: true, stakings: true, storages: true },
        });
      });

      return await Promise.all(updates);
    } catch (error) {
      console.error('Error updating investment info:', error);
      throw error;
    }
  }
}
