import { IsDate, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { StorageLocation } from 'src/storage-locations/dto/storage-locations.dto';
import { ApiProperty } from '@nestjs/swagger';

export class Storage {
  id: string;
  userId: string;
  investmentId: string;
  amount: number;
  location: StorageLocation;
  date: Date;
}

export class CreateStorageDto {
  @ApiProperty()
  @IsUUID()
  investmentId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsUUID()
  storageLocationId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}

export class UpdateStorageDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsUUID()
  storageLocationId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}

export class DeleteStorageDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
