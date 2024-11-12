import { Injectable } from '@nestjs/common';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { InvestmentsService } from '../investments/investments.service';
import { PortfolioHistoryEntity } from 'src/entities/portfolio-history.entity';
import { PrismaService } from '../prisma/prisma.service';
import { subDays } from 'date-fns';

interface PortfolioHistoryCache {
  chart_data_id: string;
  investmentId: string;
  date: string;
  price: number;
  cumulative_quantity: number;
  investment_value: number;
}

@Injectable()
export class PortfolioService {
  constructor(
    private coingeckoService: CoingeckoService,
    private investmentsService: InvestmentsService,
    private prisma: PrismaService,
  ) {}

  async getPortfolioHistory(
    userId: string,
    days: number,
  ): Promise<PortfolioHistoryEntity[]> {
    const endDate = new Date();
    const startDate = subDays(endDate, +days + 1);

    const portfolioHistoryCache: PortfolioHistoryCache[] =
      await this.prisma.getPrismaClient(userId).$queryRaw`
WITH
  valid_transactions AS (
    SELECT
      t."investmentId",
      t.date,
      SUM(
        CASE
          WHEN t.type = 'buy' THEN t.quantity
          WHEN t.type = 'sell' THEN - t.quantity
          ELSE 0
        END
      ) OVER (
        PARTITION BY
          t."investmentId"
        ORDER BY
          t.date ROWS BETWEEN UNBOUNDED PRECEDING
          AND CURRENT ROW
      ) AS cumulative_quantity
    FROM
      public.transactions t
  ),
  latest_valid_transactions AS (
    SELECT DISTINCT
      ON (cdd."investmentId", cdd."timestamp") cdd."investmentId",
      cdd."timestamp",
      v.cumulative_quantity,
      v.date AS transaction_date
    FROM
      public.chart_data_daily cdd
      LEFT JOIN valid_transactions v ON cdd."investmentId" = v."investmentId"
      AND v.date <= cdd."timestamp"
    ORDER BY
      cdd."investmentId",
      cdd."timestamp",
      v.date DESC
  ),
  daily_data AS (
    SELECT
      cdd.id AS chart_data_id,
      cdd."investmentId",
      cdd."timestamp",
      cdd.price,
      lvt.cumulative_quantity,
      (lvt.cumulative_quantity * cdd.price) AS investment_value,
      ROW_NUMBER() OVER (
        PARTITION BY cdd."investmentId", DATE(cdd."timestamp")
        ORDER BY cdd."timestamp" DESC
      ) AS row_num
    FROM
      public.chart_data_daily cdd
      LEFT JOIN latest_valid_transactions lvt ON cdd."investmentId" = lvt."investmentId"
      AND cdd."timestamp" = lvt."timestamp"
    WHERE
      cdd.timestamp >= ${startDate}
  )
SELECT
  chart_data_id,
  "investmentId",
  DATE("timestamp") AS date,
  price,
  cumulative_quantity,
  investment_value
FROM
  daily_data
WHERE
  row_num = 1
ORDER BY
  "investmentId",
  date;
`;

    const aggregatedData: PortfolioHistoryEntity[] = Object.values(
      portfolioHistoryCache.reduce(
        (
          acc,
          { date, investment_value, investmentId, cumulative_quantity },
        ) => {
          const timestampKey = date;
          if (!acc[timestampKey]) {
            acc[timestampKey] = {
              date: timestampKey,
              totalValue: 0,
              investments: [],
            };
          }
          acc[timestampKey].totalValue += investment_value;
          const existingInvestment = acc[timestampKey].investments.find(
            (investment) => investment.investmentId === investmentId,
          );
          if (existingInvestment) {
            existingInvestment.totalQuantity += cumulative_quantity;
            existingInvestment.totalValue += investment_value;
          } else {
            acc[timestampKey].investments.push({
              investmentId,
              totalQuantity: cumulative_quantity,
              totalValue: investment_value,
            });
          }
          return acc;
        },
        {} as Record<string, PortfolioHistoryEntity>,
      ),
    );

    return aggregatedData;
  }
}
