import { ApiProperty } from '@nestjs/swagger';
import { Staking } from '@prisma/client';
import { StorageLocationEntity } from './storage-location.entity';

export class StakingEntity implements Staking {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  websiteLink: string;

  @ApiProperty()
  coolDownPeriod: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  storageLocationId: string;

  @ApiProperty({ type: StorageLocationEntity })
  location: StorageLocationEntity;
}
