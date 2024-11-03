import { IsOptional, IsString, IsUUID } from 'class-validator';

export class StorageLocation {
  id: string;
  userId: string;
  name: string;
  image: string;
}

export class CreateStorageLocationDto {
  @IsString()
  name: string;

  @IsString()
  image: string;
}

export class UpdateStorageLocationDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;
}

export class DelteStorageLocationDto {
  @IsUUID()
  id: string;
}
