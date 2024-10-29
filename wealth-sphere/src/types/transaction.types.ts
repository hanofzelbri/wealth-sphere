export interface CreateTransactionDto {
  investmentId: string;
  quantity: number;
  price: number;
  date: Date;
  type: "buy" | "sell";
}

export interface UpdateTransactionDto {
  quantity?: number;
  price: number;
  date?: Date;
  type?: "buy" | "sell";
}

export interface Transaction {
  id: string;
  investmentId: string;
  quantity: number;
  price: number;
  date: Date;
  type: "buy" | "sell";
}
