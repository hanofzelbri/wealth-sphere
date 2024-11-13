import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StakingPercentageEntity } from 'src/entities/staking-percentage.entity';

@Injectable()
export class StakingsService {
  constructor(private prisma: PrismaService) {}

  async getAllStakings(userId: string) {
    return await this.prisma
      .getPrismaClient(userId)
      .staking.findMany({ where: { userId }, include: { location: true } });
  }

  async getStakingById(id: string, userId: string) {
    return await this.prisma.getPrismaClient(userId).staking.findFirst({
      where: { id, userId },
      include: { location: true },
    });
  }

  async createStaking(userId: string, data: any) {
    return await this.prisma.getPrismaClient(userId).staking.create({
      data: { ...data, userId },
      include: { location: true },
    });
  }

  async updateStaking(id: string, userId: string, data: any) {
    return await this.prisma.getPrismaClient(userId).staking.updateMany({
      where: { id, userId },
      data: { ...data, userId },
    });
  }

  async deleteStaking(stakingId: string, userId: string) {
    const client = this.prisma.getPrismaClient(userId);
    const deleteStaking = await client.staking.findFirstOrThrow({
      where: { id: stakingId, investment: { userId } },
    });
    return await client.staking.deleteMany({
      where: {
        id: deleteStaking.id,
        userId,
      },
    });
  }

  async getAllStakingPercentages(
    userId: string,
  ): Promise<StakingPercentageEntity[]> {
    return await this.prisma.getPrismaClient(userId).$queryRaw`
      SELECT
          aggregated_stakings."investmentId",
          aggregated_stakings."totalStakedValue",
          SUM(t.quantity) AS "totalTransactionValue",
          CASE 
              WHEN SUM(t.quantity) > 0 THEN 
                  (aggregated_stakings."totalStakedValue" / SUM(t.quantity)) * 100
              ELSE 
                  0
          END AS "percentageStaked"
      FROM
          (
              SELECT
                  s."investmentId",
                  SUM(s.amount) AS "totalStakedValue"
              FROM
                  stakings s
              GROUP BY
                  s."investmentId"
          ) AS aggregated_stakings
      LEFT JOIN
          transactions t ON aggregated_stakings."investmentId" = t."investmentId"
      GROUP BY
          aggregated_stakings."investmentId", aggregated_stakings."totalStakedValue";
    `;
  }
}
