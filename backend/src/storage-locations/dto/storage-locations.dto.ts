import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

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
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsEnum(StorageLocationType)
  storageLocationType: StorageLocationType;
}

export class UpdateStorageLocationDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsEnum(StorageLocationType)
  storageLocationType: StorageLocationType;
}

export class DelteStorageLocationDto {
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
