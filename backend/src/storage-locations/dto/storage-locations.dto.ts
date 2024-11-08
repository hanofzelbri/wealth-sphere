import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { StorageLocationType } from '@prisma/client';

export const StorageLocationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  image: z.string(),
  storageLocationType: z.nativeEnum(StorageLocationType),
});

export const CreateStorageLocationSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  storageLocationType: z.nativeEnum(StorageLocationType),
});

export const UpdateStorageLocationSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  storageLocationType: z.nativeEnum(StorageLocationType).optional(),
});

export class StorageLocationResponseDto extends createZodDto(
  StorageLocationSchema,
) {}

export class CreateStorageLocationDto extends createZodDto(
  CreateStorageLocationSchema,
) {}

export class UpdateStorageLocationDto extends createZodDto(
  UpdateStorageLocationSchema,
) {}
