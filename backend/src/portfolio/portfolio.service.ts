import { Injectable } from '@nestjs/common';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { InvestmentsService } from '../investments/investments.service';
import { PortfolioHistoryEntity } from 'src/entities/portfolio-history.entity';
import { PrismaService } from '../prisma/prisma.service';
import { isSameDay, subDays } from 'date-fns';

interface PortfolioHistoryRecord {
  ts: Date;
  investmentId: string;
  cumulativequantity: number;
  avgprice: number;
  investmentvalue: number;
}

interface TransactionCache {
  investmentId: string;
  total_quantity: number;
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
    const startDate = subDays(endDate, days);

    let timeBucketLength = '1 hour';
    if (days > 89) {
      timeBucketLength = '1 day';
    }
    const portfolioHistoryRecords: PortfolioHistoryRecord[] =
      await this.prisma.getPrismaClient(userId).$queryRaw`
WITH cumulativeQuantities AS (
    SELECT
        time_bucket(${timeBucketLength}::interval, date) AS ts,
        "investmentId",
        SUM(
            CASE 
                WHEN type = 'buy' THEN quantity
                WHEN type = 'sell' THEN -quantity
                ELSE 0
            END
        ) OVER (
            PARTITION BY "investmentId"
            ORDER BY time_bucket(${timeBucketLength}::interval, date) ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cumulativeQuantity
    FROM transactions
    WHERE date > ${startDate}
),
daily_investmentValues AS (
    SELECT
        time_bucket(${timeBucketLength}::interval, timestamp) AS ts,
        "investmentId",
        AVG(price) AS avgPrice
    FROM chart_data_daily
    WHERE timestamp > ${startDate}
    GROUP BY ts, "investmentId"
),
combinedData AS (
    SELECT
        d.ts,
        d."investmentId",
        COALESCE(c.cumulativeQuantity, 0) AS cumulativeQuantity,
        d.avgPrice,
        COALESCE(c.cumulativeQuantity, 0) * d.avgPrice AS investmentValue
    FROM daily_investmentValues d
    LEFT JOIN cumulativeQuantities c
    ON d.ts = c.ts AND d."investmentId" = c."investmentId"
)
SELECT
    ts,
    "investmentId",
    cumulativeQuantity,
    avgPrice,
    investmentValue
FROM combinedData
ORDER BY ts, "investmentId";
    `;

    const transactionCache: TransactionCache[] =
      await this.prisma.getPrismaClient(userId).$queryRaw`
SELECT
    "investmentId",
    SUM(CASE
        WHEN type = 'buy' THEN quantity
        WHEN type = 'sell' THEN -quantity
        ELSE 0
    END) AS total_quantity
FROM
    public.transactions
WHERE
    date < ${startDate}
GROUP BY
    "investmentId";
    `;
    const cache: Record<string, number> = {};
    transactionCache.forEach((record) => {
      cache[record.investmentId] = record.total_quantity;
    });

    console.log(cache);
    const updatedRecords = portfolioHistoryRecords.map((record) => {
      if (record.cumulativequantity !== 0) {
        cache[record.investmentId] = record.cumulativequantity;
        return record;
      }
      record.cumulativequantity = cache[record.investmentId] || 0;
      record.investmentvalue = record.cumulativequantity * record.avgprice;
      if (record.investmentvalue < 0) {
        console.log(record);
      }
      return record;
    });

    const ret: PortfolioHistoryEntity[] = [];
    updatedRecords.reduce((acc, current) => {
      const existingIndex = acc.findIndex((item) => {
        return isSameDay(new Date(item.timestamp), new Date(current.ts));
      });
      if (existingIndex !== -1) {
        acc[existingIndex].totalValue += current.investmentvalue;
      } else {
        acc.push({
          timestamp: current.ts,
          totalValue: current.investmentvalue,
        });
      }
      return acc;
    }, ret);
    return ret;
  }
}
