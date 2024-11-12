import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
