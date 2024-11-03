import { IsDate, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { StorageLocation } from 'src/storage-locations/dto/storage-locations.dto';

export class Storage {
  id: string;
  userId: string;
  investmentId: string;
  amount: number;
  location: StorageLocation;
  date: Date;
}

export class CreateStorageDto {
  @IsUUID()
  investmentId: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  storageLocationId: string;

  @IsDate()
  @Type(() => Date)
  date: Date;
}

export class UpdateStorageDto {
  @IsNumber()
  amount: number;

  @IsUUID()
  storageLocationId: string;

  @IsDate()
  @Type(() => Date)
  date: Date;
}

export class DeleteStorageDto {
  @IsUUID()
  id: string;
}
