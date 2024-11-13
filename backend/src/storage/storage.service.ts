import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStorageDto } from './dto/storage.dto';
import { StorageEntity } from 'src/entities/storage.entity';
import { StorageAllocationEntity } from 'src/entities/storage-allocation.entity';

@Injectable()
export class StorageService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.getPrismaClient(userId).storage.create({
      data: { ...data, userId },
      include: { location: true },
    });
  }

  async findAll(userId: string): Promise<StorageEntity[]> {
    return await this.prisma.getPrismaClient(userId).storage.findMany({
      where: { userId },
      include: { location: true },
    });
  }

  async findOne(id: string, userId: string) {
    return await this.prisma.getPrismaClient(userId).storage.findFirst({
      where: { id, userId },
      include: { location: true },
    });
  }

  async findByInvestment(investmentId: string, userId: string) {
    return await this.prisma.getPrismaClient(userId).storage.findMany({
      where: { investmentId, userId },
      include: { location: true },
    });
  }

  async update(id: string, userId: string, data: UpdateStorageDto) {
    return await this.prisma.getPrismaClient(userId).storage.updateMany({
      where: { id, userId },
      data: { ...data, userId },
    });
  }

  async delete(id: string, userId: string) {
    const client = this.prisma.getPrismaClient(userId);
    const deleteStorage = await client.storage.findFirstOrThrow({
      where: { id, userId },
    });
    return await client.storage.deleteMany({
      where: {
        id: deleteStorage.id,
        userId,
      },
    });
  }

  async getAllocationByLocation(
    userId: string,
  ): Promise<StorageAllocationEntity[]> {
    const client = this.prisma.getPrismaClient(userId);

    const storages = await client.storage.findMany({
      where: { userId },
      include: {
        location: true,
        investment: true,
      },
    });

    const locationTotals = storages.reduce(
      (acc, storage) => {
        const locationId = storage.storageLocationId;
        if (!acc[locationId]) {
          acc[locationId] = {
            locationId,
            locationName: storage.location.name,
            totalValue: 0,
          };
        }
        acc[locationId].totalValue +=
          storage.amount * storage.investment.currentPrice || 0;
        return acc;
      },
      {} as Record<string, Omit<StorageAllocationEntity, 'percentage'>>,
    );

    const totalAmount = Object.values(locationTotals).reduce(
      (sum, location) => sum + location.totalValue,
      0,
    );

    return Object.values(locationTotals).map((location) => ({
      ...location,
      percentage:
        totalAmount > 0 ? (location.totalValue / totalAmount) * 100 : 0,
    }));
  }
}
