export interface Investment {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  transactions: Transaction[];
}
