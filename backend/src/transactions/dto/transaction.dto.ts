import { IsNumber, IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  investmentId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsDate()
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
  @IsDate()
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
