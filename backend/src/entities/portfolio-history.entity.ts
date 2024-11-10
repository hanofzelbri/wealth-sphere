import { ApiProperty } from '@nestjs/swagger';

export class InvestmentAggregate {
  @ApiProperty()
  coinId: string;

  @ApiProperty()
  value: number;
}

export class PortfolioHistoryEntity {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  totalValue: number;

  @ApiProperty({ type: [InvestmentAggregate] })
  investments: InvestmentAggregate[];
}
