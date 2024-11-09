import { ApiProperty } from '@nestjs/swagger';
import { StorageLocationType } from '@prisma/client';

export class StorageLocationEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: StorageLocationType;
}
