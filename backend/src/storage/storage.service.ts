import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStorageDto, UpdateStorageDto } from './dto/storage.dto';
import { Storage, StorageLocation } from '@prisma/client';

type StorageWithStorageLocation = Storage & { location: StorageLocation };

@Injectable()
export class StorageService {
  constructor(private prisma: PrismaService) {}

  async create(
    createStorageDto: CreateStorageDto,
    userId: string,
  ): Promise<StorageWithStorageLocation> {
    return this.prisma.getPrismaClient(userId).storage.create({
      data: { ...createStorageDto, userId },
      include: { location: true },
    });
  }

  async findAll(userId: string): Promise<StorageWithStorageLocation[]> {
    return this.prisma.getPrismaClient(userId).storage.findMany({
      where: { userId },
      include: { location: true },
    });
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<StorageWithStorageLocation> {
    return this.prisma.getPrismaClient(userId).storage.findFirst({
      where: { id, userId },
      include: { location: true },
    });
  }

  async findByInvestment(
    investmentId: string,
    userId: string,
  ): Promise<StorageWithStorageLocation[]> {
    return this.prisma.getPrismaClient(userId).storage.findMany({
      where: { investmentId, userId },
      include: { location: true },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateStorageDto,
  ): Promise<StorageWithStorageLocation> {
    return this.prisma.getPrismaClient(userId).storage.update({
      where: { id, userId },
      data,
      include: { location: true },
    });
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<StorageWithStorageLocation> {
    return await this.prisma.getPrismaClient(userId).storage.delete({
      where: { id, userId },
      include: { location: true },
    });
  }
}
