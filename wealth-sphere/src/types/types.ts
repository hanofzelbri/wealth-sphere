import { Transaction } from "./transaction.types";
import { Staking } from "./staking.types";
export interface Investment {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  transactions: Transaction[];
  stakings: Staking[];
  stakingRewards?: number;
  storageUsage?: number;
}
