import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateInvestmentSchema = z.object({
  coinId: z.string(),
});

export class CreateInvestmentDto extends createZodDto(CreateInvestmentSchema) {}
