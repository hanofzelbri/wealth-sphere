import {
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateStakingDto {
  @IsUUID()
  investmentId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  location: string;

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
  @IsString()
  location?: string;

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
  location: string;
  websiteLink: string;
  coolDownPeriod: number;
  startDate: Date;
}
