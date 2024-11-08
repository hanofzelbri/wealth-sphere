import { IsString } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  id: string;
}
