import { Transaction } from "./transaction.types";
import { Staking } from "./staking.types";
import { Storage } from "./storage.types";

export interface Investment {
  id: string;
  coinId: string;
  symbol: string;
  image: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  transactions: Transaction[];
  stakings: Staking[];
  storages: Storage[];
}

export interface CreateInvestmentInput {
  coinId: string;
}

export interface UpdateInvestmentInput {
  id: string;
  coinId: string;
}

export interface DeleteInvestmentInput {
  id: string;
}
