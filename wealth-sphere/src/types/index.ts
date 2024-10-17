export interface Investment {
    id: string;
    name: string;
    currentPrice: number;
    transactions: Transaction[];
}

export interface Transaction {
  id: string;
  quantity: number;
  price: number;
  date: string;
  type: "buy" | "sell";
}
