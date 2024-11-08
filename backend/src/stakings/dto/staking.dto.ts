import {
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StorageLocation } from 'src/storage-locations/dto/storage-locations.dto';

export class CreateStakingDto {
  @ApiProperty()
  @IsUUID()
  public investmentId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  public amount: number;

  @ApiProperty()
  @IsUUID()
  public storageLocationId: string;

  @ApiProperty()
  @IsString()
  public websiteLink: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  public coolDownPeriod: number;

  @ApiProperty()
  @IsDateString()
  public startDate: Date;
}

export class UpdateStakingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  storageLocationId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  websiteLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  coolDownPeriod?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;
}

export class StakingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  location: StorageLocation;

  @ApiProperty()
  websiteLink: string;

  @ApiProperty()
  coolDownPeriod: number;

  @ApiProperty()
  startDate: Date;
}
