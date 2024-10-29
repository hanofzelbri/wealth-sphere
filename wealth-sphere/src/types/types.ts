import { Transaction } from "./transaction.types";
import { Staking } from "./staking.types";
export interface Investment {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  transactions: Transaction[];
  stakings: Staking[];
  storageUsage?: number;
}
