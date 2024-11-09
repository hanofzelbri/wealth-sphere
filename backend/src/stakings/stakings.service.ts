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
    return await this.prisma.getPrismaClient(userId).staking.findUnique({
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
    return await this.prisma.getPrismaClient(userId).staking.update({
      where: { id },
      data: { ...data, userId },
      include: { location: true },
    });
  }

  async deleteStaking(stakingId: string, userId: string): Promise<void> {
    await this.prisma.getPrismaClient(userId).staking.delete({
      where: { id: stakingId, investment: { userId } },
    });
  }
}
