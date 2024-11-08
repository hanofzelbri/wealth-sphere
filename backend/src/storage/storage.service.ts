import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageLocationResponseDto } from 'src/storage-locations/dto/storage-locations.dto';

@Injectable()
export class StorageService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any): Promise<StorageLocationResponseDto> {
    return this.prisma.getPrismaClient(userId).storage.create({
      data: { ...data, userId },
      include: { location: true },
    });
  }

  async findAll(userId: string): Promise<StorageLocationResponseDto[]> {
    return this.prisma.getPrismaClient(userId).storage.findMany({
      where: { userId },
      include: { location: true },
    });
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<StorageLocationResponseDto> {
    return this.prisma.getPrismaClient(userId).storage.findFirst({
      where: { id, userId },
      include: { location: true },
    });
  }

  async findByInvestment(
    investmentId: string,
    userId: string,
  ): Promise<StorageLocationResponseDto[]> {
    return this.prisma.getPrismaClient(userId).storage.findMany({
      where: { investmentId, userId },
      include: { location: true },
    });
  }

  async update(
    id: string,
    userId: string,
    data: any,
  ): Promise<StorageLocationResponseDto> {
    return this.prisma.getPrismaClient(userId).storage.update({
      where: { id, userId },
      data: { ...data, userId },
      include: { location: true },
    });
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<StorageLocationResponseDto> {
    return await this.prisma.getPrismaClient(userId).storage.delete({
      where: { id, userId },
      include: { location: true },
    });
  }
}
