import { ApiProperty } from '@nestjs/swagger';
import { Storage } from '@prisma/client';
import { StorageLocationEntity } from './storage-location.entity';

export class StorageEntity implements Storage {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  storageLocationId: string;

  @ApiProperty({ type: StorageLocationEntity })
  location: StorageLocationEntity;
}
