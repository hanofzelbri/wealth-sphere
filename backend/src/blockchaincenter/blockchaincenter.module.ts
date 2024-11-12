import { Module } from '@nestjs/common';
import { BlockchainCenterController } from './blockchaincenter.controller';
import { AltcoinSeasonService } from './blockchaincenter.service';

@Module({
  controllers: [BlockchainCenterController],
  providers: [AltcoinSeasonService],
  exports: [AltcoinSeasonService], // Export the service if you need to use it in other modules
})
export class BlockchainCenterModule {}
