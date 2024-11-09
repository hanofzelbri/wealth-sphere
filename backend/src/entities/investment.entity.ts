import { ApiProperty } from '@nestjs/swagger';
import { Staking, Transaction } from '@prisma/client';
import { TransactionEntity } from './transaction.entity';
import { StakingEntity } from './staking.entity';
import { StorageEntity } from './storage.entity';

export class InvestmentEntity {
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

  @ApiProperty()
  transactions: TransactionEntity[];

  @ApiProperty()
  stakings: StakingEntity[];

  @ApiProperty()
  storages: StorageEntity[];
}
