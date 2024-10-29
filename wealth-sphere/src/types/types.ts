import { Transaction } from "./transaction.types";

export interface Storage {
  id: string;
  amount: number;
  location: string;
  date: string;
}

export interface Staking {
  id: string;
  amount: number;
  location: string;
  websiteLink: string;
  coolDownPeriod: number;
  startDate: string;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  transactions: Transaction[];
  stakingRewards?: number;
  storageUsage?: number;
}
