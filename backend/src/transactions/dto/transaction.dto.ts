import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

import { TransactionType as PrismaTransactionType } from '@prisma/client';

export enum TransactionType {
  buy = 'buy',
  sell = 'sell',
}

export class CreateTransactionDto {
  @IsUUID()
  investmentId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsDateString()
  date: Date;

  @IsEnum(TransactionType)
  type: TransactionType;
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
  @IsEnum(TransactionType)
  type?: TransactionType;
}

export class TransactionResponseDto {
  id: string;
  investmentId: string;
  quantity: number;
  price: number;
  date: Date;
  type: TransactionType;
}

export function mapTransactionType(
  type: PrismaTransactionType,
): TransactionType {
  const mapping = {
    [PrismaTransactionType.buy]: TransactionType.buy,
    [PrismaTransactionType.sell]: TransactionType.sell,
  };
  return mapping[type];
}
