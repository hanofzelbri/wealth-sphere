export type TransactionType = "buy" | "sell";

export interface Transaction {
  id: string;
  investmentId: string;
  quantity: number;
  price: number;
  date: Date;
  type: TransactionType;
}

export interface CreateTransactionDto {
  investmentId: string;
  quantity: number;
  price: number;
  date: Date;
  type: TransactionType;
}

export interface UpdateTransactionDto {
  quantity?: number;
  price: number;
  date?: Date;
  type?: TransactionType;
}
