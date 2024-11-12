import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestmentDto } from './dto/investment.dto';
import { CoingeckoService } from 'src/coingecko/coingecko.service';

@Injectable()
export class InvestmentsService {
  constructor(
    private prisma: PrismaService,
    private coingeckoService: CoingeckoService,
  ) {}

  async getAllInvestments(userId: string) {
    return this.prisma.getPrismaClient(userId).investment.findMany({
      where: { userId },
      include: {
        transactions: true,
        stakings: { include: { location: true } },
        storages: { include: { location: true } },
      },
    });
  }

  async getInvestmentById(id: string, userId: string) {
    return this.prisma.getPrismaClient(userId).investment.findUnique({
      where: { id, userId },
      include: {
        transactions: true,
        stakings: { include: { location: true } },
        storages: { include: { location: true } },
      },
    });
  }

  async getInvestmentBySymbol(symbol: string, userId: string) {
    return this.prisma.getPrismaClient(userId).investment.findFirstOrThrow({
      where: { symbol, userId },
      include: {
        transactions: true,
        stakings: { include: { location: true } },
        storages: { include: { location: true } },
      },
    });
  }

  async createInvestment(data: CreateInvestmentDto, userId: string) {
    const coinPrices = await this.coingeckoService.fetchCoinPrices([
      data.coinId,
    ]);
    const coinInfo = coinPrices[0];
    const ret = await this.prisma.getPrismaClient(userId).investment.create({
      data: {
        coinId: data.coinId,
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

    await this.coingeckoService.storeMarketChartData(userId);

    return ret;
  }

  async deleteInvestment(id: string, userId: string) {
    return this.prisma.getPrismaClient(userId).investment.delete({
      where: { id, userId },
      include: {
        transactions: true,
        stakings: { include: { location: true } },
        storages: { include: { location: true } },
      },
    });
  }
}
