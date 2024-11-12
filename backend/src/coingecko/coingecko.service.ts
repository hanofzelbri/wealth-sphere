import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CoinPrice, CoinMarketChart } from './interfaces';
import { BaseApiService } from '../common/base-api.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from 'src/config/config.service';
import { subDays } from 'date-fns';

@Injectable()
export class CoingeckoService extends BaseApiService {
  constructor(
    private prisma: PrismaService,
    protected configService: ConfigService,
  ) {
    super(configService);
  }

  async getAllMarketChartData(userId: string, days: number) {
    const startDate = subDays(new Date(), days);
    const prismaClient = this.prisma.getPrismaClient(userId);
    const data =
      days < 90
        ? await prismaClient.chartDataHourly.findMany({
            where: {
              userId,
              timestamp: {
                gte: startDate,
              },
            },
            orderBy: {
              timestamp: 'asc',
            },
            select: {
              id: true,
              price: true,
              timestamp: true,
              investmentId: true,
            },
          })
        : await prismaClient.chartDataDaily.findMany({
            where: {
              userId,
              timestamp: {
                gte: startDate,
              },
            },
            orderBy: {
              timestamp: 'asc',
            },
            select: {
              id: true,
              price: true,
              timestamp: true,
              investmentId: true,
            },
          });

    const groupedData = data.reduce(
      (acc, { id, price, timestamp, investmentId }) => {
        if (!acc[investmentId]) {
          acc[investmentId] = { ids: [], prices: [], timestamps: [] };
        }
        acc[investmentId].ids.push(id);
        acc[investmentId].prices.push(price);
        acc[investmentId].timestamps.push(timestamp);
        return acc;
      },
      {},
    );

    return Object.values(groupedData).map(
      ({ ids, prices, timestamps }, index) => ({
        userId,
        investmentId: index.toString(),
        ids,
        prices,
        timestamps,
      }),
    );
  }

  async getMarketChartData(userId: string, coinId: string, days: number) {
    const startDate = subDays(new Date(), days);
    const prismaClient = this.prisma.getPrismaClient(userId);
    return days < 90
      ? await prismaClient.chartDataHourly.findMany({
          where: {
            userId,
            investment: { coinId },
            timestamp: {
              gte: startDate,
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        })
      : await prismaClient.chartDataDaily.findMany({
          where: {
            userId,
            investment: { coinId },
            timestamp: {
              gte: startDate,
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        });
  }

  async storeCoinPrices(userId: string): Promise<void> {
    try {
      const investments = await this.prisma
        .getPrismaClient(userId)
        .investment.findMany({
          where: {
            userId,
          },
          include: {
            transactions: true,
            stakings: { include: { location: true } },
            storages: { include: { location: true } },
          },
        });

      const coinIds = [...new Set(investments.map((inv) => inv.coinId))];

      const coinPrices = await this.fetchCoinPrices(coinIds);

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
          include: {
            transactions: true,
            stakings: { include: { location: true } },
            storages: { include: { location: true } },
          },
        });
      });

      await Promise.all(updates);
    } catch (error) {
      console.error('Error updating investment info:', error);
      throw error;
    }
  }

  async storeMarketChartData(userId: string): Promise<void> {
    const prismaClient = this.prisma.getPrismaClient(userId);
    const investments = await prismaClient.investment.findMany({
      where: {
        userId: userId,
      },
    });

    for (const investment of investments) {
      const chartData90 = await this.fetchCoinMarketChart(
        investment.coinId,
        'usd',
        89,
      );
      const chartData365 = await this.fetchCoinMarketChart(
        investment.coinId,
        'usd',
        365,
      );

      for (const data of chartData365.prices) {
        await prismaClient.chartDataDaily.upsert({
          where: {
            userId: userId,
            investmentId_timestamp: {
              investmentId: investment.id,
              timestamp: new Date(data[0]),
            },
          },
          update: {
            price: data[1],
          },
          create: {
            userId: userId,
            investmentId: investment.id,
            timestamp: new Date(data[0]),
            price: data[1],
          },
        });
      }

      for (const data of chartData90.prices) {
        await prismaClient.chartDataHourly.upsert({
          where: {
            userId: userId,
            investmentId_timestamp: {
              investmentId: investment.id,
              timestamp: new Date(data[0]),
            },
          },
          update: {
            price: data[1],
          },
          create: {
            userId: userId,
            investmentId: investment.id,
            timestamp: new Date(data[0]),
            price: data[1],
          },
        });
      }
    }
  }

  async fetchCoinPrices(
    coinIds: string[],
    currency = 'usd',
  ): Promise<CoinPrice[]> {
    if (!coinIds || coinIds.length === 0) {
      throw new HttpException('No coins provided', HttpStatus.BAD_REQUEST);
    }

    const response = await this.fetchWithRetry<CoinPrice[]>(
      `/coins/markets?vs_currency=${currency}&ids=${coinIds.join(',')}&order=market_cap_desc&sparkline=false`,
    );

    return response.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      ath: coin.ath,
      ath_change_percentage: coin.ath_change_percentage,
      ath_date: coin.ath_date,
      fully_diluted_valuation: coin.fully_diluted_valuation,
    }));
  }

  private async fetchCoinMarketChart(
    coinId: string,
    currency = 'usd',
    days,
  ): Promise<CoinMarketChart> {
    return await this.fetchWithRetry<CoinMarketChart>(
      `/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
    );
  }
}
