import { ApiProperty } from '@nestjs/swagger';

export class StorageAllocationEntity {
  @ApiProperty()
  locationId: string;

  @ApiProperty()
  locationName: string;

  @ApiProperty()
  totalValue: number;

  @ApiProperty()
  percentage: number;
}
