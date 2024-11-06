export type TransactionType = "buy" | "sell";

export interface Transaction {
  id: string;
  investmentId: string;
  quantity: number;
  price: number;
  date: Date;
  type: TransactionType;
}

export interface CreateTransactionInput {
  investmentId: string;
  quantity: number;
  price: number;
  date: Date;
  type: TransactionType;
}

export interface UpdateTransactionInput {
  id: string;
  quantity?: number;
  price: number;
  date?: Date;
  type?: TransactionType;
}

export interface DeleteTransactionInput {
  id: string;
}
