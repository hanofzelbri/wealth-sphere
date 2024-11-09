import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

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

export class CreateStakingDto extends createZodDto(CreateStakingSchema) {}

export class UpdateStakingDto extends createZodDto(UpdateStakingSchema) {}
