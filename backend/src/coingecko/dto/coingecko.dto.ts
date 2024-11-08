import { ApiProperty } from '@nestjs/swagger';

export class MarketData {
  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [Number] })
  ids: number[];

  @ApiProperty({ type: [Number] })
  prices: number[];

  @ApiProperty({ type: [Date] })
  timestamps: Date[];
}
