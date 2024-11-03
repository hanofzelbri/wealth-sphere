import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Staking, StorageLocation } from '@prisma/client';
import { CreateStakingDto, UpdateStakingDto } from './dto/staking.dto';

type StakingWithLocation = Staking & { location: StorageLocation };

@Injectable()
export class StakingsService {
  constructor(private prisma: PrismaService) {}

  async getAllStakings(userId: string): Promise<StakingWithLocation[]> {
    return await this.prisma
      .getPrismaClient(userId)
      .staking.findMany({ where: { userId }, include: { location: true } });
  }

  async getStakingById(
    id: string,
    userId: string,
  ): Promise<StakingWithLocation | null> {
    return await this.prisma.getPrismaClient(userId).staking.findUnique({
      where: { id, userId },
      include: { location: true },
    });
  }

  async createStaking(
    data: CreateStakingDto,
    userId: string,
  ): Promise<StakingWithLocation> {
    return await this.prisma.getPrismaClient(userId).staking.create({
      data,
      include: { location: true },
    });
  }

  async updateStaking(
    id: string,
    data: UpdateStakingDto,
    userId: string,
  ): Promise<StakingWithLocation> {
    return await this.prisma.getPrismaClient(userId).staking.update({
      where: { id },
      data,
      include: { location: true },
    });
  }

  async deleteStaking(stakingId: string, userId: string): Promise<Staking> {
    return await this.prisma.getPrismaClient(userId).staking.delete({
      where: { id: stakingId, investment: { userId } },
    });
  }
}
