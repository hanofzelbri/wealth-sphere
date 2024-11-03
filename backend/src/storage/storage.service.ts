import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStorageDto, Storage, UpdateStorageDto } from './dto/storage.dto';

@Injectable()
export class StorageService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Storage[]> {
    return this.prisma.getPrismaClient(userId).storage.findMany({
      where: { userId },
      include: {
        investment: true,
        location: true,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Storage> {
    return this.prisma.getPrismaClient(userId).storage.findFirst({
      where: { id, userId },
      include: {
        investment: true,
        location: true,
      },
    });
  }

  async findByInvestment(
    investmentId: string,
    userId: string,
  ): Promise<Storage[]> {
    return this.prisma.getPrismaClient(userId).storage.findMany({
      where: { investmentId, userId },
      include: {
        investment: true,
        location: true,
      },
    });
  }

  async create(userId: string, data: CreateStorageDto): Promise<Storage> {
    return this.prisma.getPrismaClient(userId).storage.create({
      data: {
        ...data,
        userId,
      },
      include: {
        investment: true,
        location: true,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateStorageDto,
  ): Promise<Storage> {
    return this.prisma.getPrismaClient(userId).storage.update({
      where: { id, userId },
      data,
      include: {
        investment: true,
        location: true,
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.getPrismaClient(userId).storage.delete({
      where: { id, userId },
    });
  }
}
