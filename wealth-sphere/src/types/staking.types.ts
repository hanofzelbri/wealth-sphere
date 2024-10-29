export interface Staking {
  id: string;
  investmentId: string;
  amount: number;
  location: string;
  websiteLink: string;
  coolDownPeriod: number;
  startDate: Date;
}

export interface CreateStakingInput {
  investmentId: string;
  amount: number;
  location: string;
  websiteLink: string;
  coolDownPeriod: number;
  startDate: Date;
}

export interface UpdateStakingInput {
  amount?: number;
  location?: string;
  websiteLink?: string;
  coolDownPeriod?: number;
  startDate?: Date;
} 
