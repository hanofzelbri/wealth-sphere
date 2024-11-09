import { ApiProperty } from '@nestjs/swagger';
import { StorageLocation, StorageLocationType } from '@prisma/client';

export class StorageLocationEntity implements StorageLocation {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty({ enum: StorageLocationType })
  storageLocationType: StorageLocationType;
}
