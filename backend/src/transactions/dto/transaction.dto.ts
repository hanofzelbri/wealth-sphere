import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { TransactionType } from '@prisma/client';

export const CreateTransactionSchema = z.object({
  investmentId: z.string(),
  quantity: z.number(),
  price: z.number(),
  date: z.date(),
  type: z.nativeEnum(TransactionType),
});

export const UpdateTransactionSchema = z.object({
  quantity: z.number().optional(),
  price: z.number().optional(),
  date: z.date().optional(),
  type: z.nativeEnum(TransactionType).optional(),
});

export class CreateTransactionDto extends createZodDto(
  CreateTransactionSchema,
) {}

export class UpdateTransactionDto extends createZodDto(
  UpdateTransactionSchema,
) {}
