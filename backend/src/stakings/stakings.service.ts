import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StakingResponseDto } from './dto/staking.dto';

@Injectable()
export class StakingsService {
  constructor(private prisma: PrismaService) {}

  async getAllStakings(userId: string): Promise<StakingResponseDto[]> {
    return await this.prisma
      .getPrismaClient(userId)
      .staking.findMany({ where: { userId }, include: { location: true } });
  }

  async getStakingById(
    id: string,
    userId: string,
  ): Promise<StakingResponseDto | null> {
    return await this.prisma.getPrismaClient(userId).staking.findUnique({
      where: { id, userId },
      include: { location: true },
    });
  }

  async createStaking(userId: string, data: any): Promise<StakingResponseDto> {
    return await this.prisma.getPrismaClient(userId).staking.create({
      data: { ...data, userId },
      include: { location: true },
    });
  }

  async updateStaking(
    id: string,
    userId: string,
    data: any,
  ): Promise<StakingResponseDto> {
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
