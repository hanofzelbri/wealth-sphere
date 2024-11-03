import { Module } from '@nestjs/common';
import { StorageLocationsController } from './storage-locations.controller';
import { StorageLocationsService } from './storage-locations.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StorageLocationsController],
  providers: [StorageLocationsService, PrismaService],
  exports: [StorageLocationsService],
})
export class StorageLocationsModule {}
