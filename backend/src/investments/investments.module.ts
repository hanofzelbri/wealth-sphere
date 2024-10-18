import { Module } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [InvestmentsService, PrismaService],
  controllers: [InvestmentsController],
})
export class InvestmentsModule {}
