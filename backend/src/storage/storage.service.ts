import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStorageDto } from './dto/storage.dto';

@Injectable()
export class StorageService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.getPrismaClient(userId).storage.create({
      data: { ...data, userId },
      include: { location: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.getPrismaClient(userId).storage.findMany({
      where: { userId },
      include: { location: true },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.getPrismaClient(userId).storage.findFirst({
      where: { id, userId },
      include: { location: true },
    });
  }

  async findByInvestment(investmentId: string, userId: string) {
    return this.prisma.getPrismaClient(userId).storage.findMany({
      where: { investmentId, userId },
      include: { location: true },
    });
  }

  async update(id: string, userId: string, data: UpdateStorageDto) {
    return this.prisma.getPrismaClient(userId).storage.update({
      where: { id_date: { id, date: data.date } },
      data: { ...data, userId },
      include: { location: true },
    });
  }

  async delete(id: string, userId: string) {
    const client = this.prisma.getPrismaClient(userId);
    const deleteStorage = await client.storage.findFirstOrThrow({
      where: { id, userId },
    });
    return await client.storage.delete({
      where: {
        id_date: { id: deleteStorage.id, date: deleteStorage.date },
        userId,
      },
      include: { location: true },
    });
  }
}
