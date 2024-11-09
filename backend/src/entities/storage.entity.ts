import { ApiProperty } from '@nestjs/swagger';
import { StorageLocationEntity } from './storage-location.entity';

export class StorageEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  location: StorageLocationEntity;

  @ApiProperty()
  locationId: string;

  @ApiProperty()
  amount: number;
}
