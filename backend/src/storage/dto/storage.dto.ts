import { createZodDto } from '@anatine/zod-nestjs';
import { StorageLocationResponseDto } from 'src/storage-locations/dto/storage-locations.dto';
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

export const StorageResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  investmentId: z.string().uuid(),
  amount: z.number().positive(),
  locationId: z.string().uuid(),
  location: z.lazy(() => StorageLocationResponseDto.zodSchema),
  date: z.date(),
});

export class CreateStorageDto extends createZodDto(StorageCreateSchema) {}

export class UpdateStorageDto extends createZodDto(StorageUpdateSchema) {}

export class StorageResponseDto extends createZodDto(StorageResponseSchema) {}
