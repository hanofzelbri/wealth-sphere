import { Module } from '@nestjs/common';
import { StakingsService } from './stakings.service';
import { StakingsController } from './stakings.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [StakingsService, PrismaService],
  controllers: [StakingsController],
})
export class StakingsModule {}
