import { ApiProperty } from '@nestjs/swagger';

export class InvestmentAggregate {
  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  totalValue: number;
}

export class PortfolioHistoryEntity {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  totalValue: number;

  // @ApiProperty({ type: [InvestmentAggregate] })
  // investments: InvestmentAggregate[];
}
