import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { StorageLocationType as PrismaStorageLocationType } from '@prisma/client';

export enum StorageLocationType {
  hardwareWallet = 'hardwareWallet',
  softwareWallet = 'softwareWallet',
  exchange = 'exchange',
}

export class StorageLocation {
  id: string;
  userId: string;
  name: string;
  image: string;
  storageLocationType: StorageLocationType;
}

export class CreateStorageLocationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty({ enum: StorageLocationType })
  @IsEnum(StorageLocationType)
  storageLocationType: StorageLocationType;
}

export class UpdateStorageLocationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ required: false, enum: StorageLocationType })
  @IsOptional()
  @IsEnum(StorageLocationType)
  storageLocationType: StorageLocationType;
}

export class DelteStorageLocationDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export function mapStorageLocationType(
  type: PrismaStorageLocationType,
): StorageLocationType {
  const mapping = {
    [PrismaStorageLocationType.hardwareWallet]:
      StorageLocationType.hardwareWallet,
    [PrismaStorageLocationType.softwareWallet]:
      StorageLocationType.softwareWallet,
    [PrismaStorageLocationType.exchange]: StorageLocationType.exchange,
  };
  return mapping[type];
}
