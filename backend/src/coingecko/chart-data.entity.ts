import { ApiProperty } from '@nestjs/swagger';
import { ChartDataDaily, ChartDataHourly } from '@prisma/client';

export class ChartDataEntity implements ChartDataHourly, ChartDataDaily {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  price: number;
}
