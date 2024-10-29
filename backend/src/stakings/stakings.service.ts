import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Staking } from '@prisma/client';
import { CreateStakingDto, UpdateStakingDto } from './dto/staking.dto';

@Injectable()
export class StakingsService {
  constructor(private prisma: PrismaService) {}

  async getAllStakings(userId: string): Promise<Staking[]> {
    return await this.prisma.getPrismaClient(userId).staking.findMany();
  }

  async getStakingById(id: string, userId: string): Promise<Staking | null> {
    return await this.prisma.getPrismaClient(userId).staking.findUnique({
      where: { id },
    });
  }

  async createStaking(
    data: CreateStakingDto,
    userId: string,
  ): Promise<Staking> {
    try {
      return await this.prisma.getPrismaClient(userId).staking.create({
        data,
      });
    } catch (error) {
      console.error('Error adding staking:', error);
      throw error;
    }
  }

  async updateStaking(
    id: string,
    data: UpdateStakingDto,
    userId: string,
  ): Promise<Staking> {
    try {
      return await this.prisma.getPrismaClient(userId).staking.update({
        where: { id },
        data: {
          ...(data.amount && { amount: data.amount }),
          ...(data.location && { location: data.location }),
          ...(data.websiteLink && { websiteLink: data.websiteLink }),
          ...(data.coolDownPeriod && { coolDownPeriod: data.coolDownPeriod }),
          ...(data.startDate && { startDate: data.startDate }),
        },
      });
    } catch (error) {
      console.error('Error updating staking:', error);
      throw error;
    }
  }

  async deleteStaking(stakingId: string, userId: string): Promise<Staking> {
    try {
      return await this.prisma.getPrismaClient(userId).staking.delete({
        where: { id: stakingId, investment: { userId } },
      });
    } catch (error) {
      console.error('Error deleting staking:', error);
      throw error;
    }
  }
}
