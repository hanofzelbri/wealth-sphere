import { Module } from '@nestjs/common';
import { CoingeckoController } from './coingecko.controller';
import { CoingeckoService } from './coingecko.service';
import { ConfigService } from 'src/config/config.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CoingeckoController],
  providers: [CoingeckoService, ConfigService, PrismaService],
  exports: [CoingeckoService],
})
export class CoingeckoModule {}
