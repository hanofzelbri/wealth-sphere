import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { StorageLocationResponseDto } from 'src/storage-locations/dto/storage-locations.dto';

export const CreateStakingSchema = z.object({
  investmentId: z.string().uuid(),
  amount: z.number().positive(),
  storageLocationId: z.string().uuid(),
  websiteLink: z.string(),
  coolDownPeriod: z.number().positive(),
  startDate: z.date(),
});

export const UpdateStakingSchema = z.object({
  amount: z.number().positive().optional(),
  storageLocationId: z.string().uuid().optional(),
  websiteLink: z.string().optional(),
  coolDownPeriod: z.number().positive().optional(),
  startDate: z.date().optional(),
});

export const StakingResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  investmentId: z.string().uuid(),
  amount: z.number().positive(),
  storageLocationId: z.string().uuid().optional(),
  location: z.lazy(() => StorageLocationResponseDto.zodSchema),
  websiteLink: z.string(),
  coolDownPeriod: z.number().positive(),
  startDate: z.date(),
});

export class CreateStakingDto extends createZodDto(CreateStakingSchema) {}

export class UpdateStakingDto extends createZodDto(UpdateStakingSchema) {}

export class StakingResponseDto extends createZodDto(StakingResponseSchema) {}
