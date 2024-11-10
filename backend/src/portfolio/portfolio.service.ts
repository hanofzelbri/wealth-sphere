import { Injectable } from '@nestjs/common';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { InvestmentsService } from '../investments/investments.service';
import { PortfolioHistoryEntity } from 'src/entities/portfolio-history.entity';

@Injectable()
export class PortfolioService {
  constructor(
    private coingeckoService: CoingeckoService,
    private investmentsService: InvestmentsService,
  ) {}

  async getPortfolioHistory(
    userId: string,
    days: number,
  ): Promise<PortfolioHistoryEntity[]> {
    const investments = await this.investmentsService.getAllInvestments(userId);
    const marketData = await Promise.all(
      investments.map((investment) =>
        this.coingeckoService.getMarketChartData(
          userId,
          investment.coinId,
          days,
        ),
      ),
    );

    const portfolioHistory: PortfolioHistoryEntity[] = marketData.map(
      (data, index) => {
        const historicalValues = data.map(({ timestamp, price }) => {
          const date = new Date(timestamp);
          const totalQuantity = investments.reduce((acc, investment) => {
            if (investment.coinId === investments[index].coinId) {
              return (
                acc +
                investment.transactions.reduce((txAcc, tx) => {
                  const txDate = new Date(tx.date);
                  if (txDate <= date) {
                    return txAcc + tx.quantity;
                  }
                  return txAcc;
                }, 0)
              );
            }
            return acc;
          }, 0);
          return {
            timestamp,
            value: totalQuantity * price,
          };
        });

        const uniqueInvestments = historicalValues.reduce(
          (acc, { timestamp, value }) => {
            const existing = acc.find((item) => item.timestamp === timestamp);
            if (existing) {
              existing.value += value;
            } else {
              acc.push({ timestamp, value });
            }
            return acc;
          },
          [],
        );

        return {
          timestamp: new Date(),
          totalValue: uniqueInvestments.reduce(
            (acc, { value }) => acc + value,
            0,
          ),
          investments: uniqueInvestments.map(({ value }) => ({
            coinId: investments[index].coinId,
            value,
          })),
        };
      },
    );

    return portfolioHistory;
  }
}
