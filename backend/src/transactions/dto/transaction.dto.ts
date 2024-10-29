import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  investmentId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsDateString()
  date: Date;

  @IsEnum(['buy', 'sell'])
  type: 'buy' | 'sell';
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsEnum(['buy', 'sell'])
  type?: 'buy' | 'sell';
}

export class TransactionResponseDto {
  id: string;
  investmentId: string;
  quantity: number;
  price: number;
  date: Date;
  type: 'buy' | 'sell';
}
