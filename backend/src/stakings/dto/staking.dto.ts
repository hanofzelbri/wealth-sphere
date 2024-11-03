import {
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';
import { StorageLocation } from 'src/storage-locations/dto/storage-locations.dto';

export class CreateStakingDto {
  @IsUUID()
  investmentId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsUUID()
  storageLocationId: string;

  @IsString()
  websiteLink: string;

  @IsNumber()
  @Min(0)
  coolDownPeriod: number;

  @IsDateString()
  startDate: Date;
}

export class UpdateStakingDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsUUID()
  storageLocationId: string;

  @IsOptional()
  @IsString()
  websiteLink?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coolDownPeriod?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;
}

export class StakingResponseDto {
  id: string;
  investmentId: string;
  amount: number;
  location: StorageLocation;
  websiteLink: string;
  coolDownPeriod: number;
  startDate: Date;
}
