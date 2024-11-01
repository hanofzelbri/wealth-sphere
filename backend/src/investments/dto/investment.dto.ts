import { IsString } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  id: string;
}

export class InvestmentResponseDto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
}
