import { ApiProperty } from '@nestjs/swagger';
import { Transaction, TransactionType } from '@prisma/client';

export class TransactionEntity implements Transaction {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  investmentId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;
}
