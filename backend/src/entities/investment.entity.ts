import { ApiProperty } from '@nestjs/swagger';
import { Investment } from '@prisma/client';
import { StakingEntity } from './staking.entity';
import { StorageEntity } from './storage.entity';
import { TransactionEntity } from './transaction.entity';

export class InvestmentEntity implements Investment {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  coinId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  currentPrice: number;

  @ApiProperty({ type: [TransactionEntity] })
  transactions: TransactionEntity[];

  @ApiProperty({ type: [StorageEntity] })
  storages: StorageEntity[];

  @ApiProperty({ type: [StakingEntity] })
  stakings: StakingEntity[];
}
