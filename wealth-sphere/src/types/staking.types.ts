import { StorageLocation } from "./storage-location.types";

export interface Staking {
  id: string;
  investmentId: string;
  amount: number;
  location: StorageLocation;
  websiteLink: string;
  coolDownPeriod: number;
  startDate: Date;
}

export interface CreateStakingInput {
  investmentId: string;
  amount: number;
  storageLocationId: string;
  websiteLink: string;
  coolDownPeriod: number;
  startDate: Date;
}

export interface UpdateStakingInput {
  amount?: number;
  storageLocationId?: string;
  websiteLink?: string;
  coolDownPeriod?: number;
  startDate?: Date;
}
