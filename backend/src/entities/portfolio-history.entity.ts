import { ApiProperty } from '@nestjs/swagger';

export class PortfolioHistoryEntity {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  totalValue: number;

  @ApiProperty()
  investments: {
    coinId: string;

    value: number;
  }[];
}
