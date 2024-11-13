import { ApiProperty } from '@nestjs/swagger';

export class StakingPercentageEntity {
  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  totalStakedAmount: number;

  @ApiProperty()
  totalTransactionAmount: number;

  @ApiProperty()
  percentageStaked: number;
}
