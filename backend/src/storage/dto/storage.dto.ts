import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const StorageCreateSchema = z.object({
  investmentId: z.string().uuid(),
  amount: z.number().positive(),
  storageLocationId: z.string().uuid(),
  date: z.date(),
});

export const StorageUpdateSchema = z.object({
  amount: z.number().positive(),
  storageLocationId: z.string().uuid(),
  date: z.date(),
});

export class CreateStorageDto extends createZodDto(StorageCreateSchema) {}

export class UpdateStorageDto extends createZodDto(StorageUpdateSchema) {}
