import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateStorageLocationDto,
  UpdateStorageLocationDto,
} from './dto/storage-locations.dto';
import { StorageLocation } from '@prisma/client';

@Injectable()
export class StorageLocationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<StorageLocation[]> {
    return this.prisma.getPrismaClient(userId).storageLocation.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string): Promise<StorageLocation> {
    return await this.prisma.getPrismaClient(userId).storageLocation.findFirst({
      where: { id, userId },
    });
  }

  async create(
    userId: string,
    data: CreateStorageLocationDto,
  ): Promise<StorageLocation> {
    console.log(userId, data);
    return await this.prisma
      .getPrismaClient(userId)
      .storageLocation.create({ data });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateStorageLocationDto,
  ): Promise<StorageLocation> {
    return this.prisma.getPrismaClient(userId).storageLocation.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.getPrismaClient(userId).storageLocation.delete({
      where: { id, userId },
    });
  }
}
