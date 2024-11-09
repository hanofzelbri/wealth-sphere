import { ApiProperty } from '@nestjs/swagger';
import { StorageLocationEntity } from './storage-location.entity';

export class StakingEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  investmentId: string;

  // @ApiProperty()
  // locationId: string;

  @ApiProperty()
  location: StorageLocationEntity;

  @ApiProperty()
  amount: number;
}
