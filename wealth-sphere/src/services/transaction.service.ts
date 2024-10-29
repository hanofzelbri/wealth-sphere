import { api } from "@/lib/api";
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from "@/types/transaction.types";
import { BehaviorSubject, Observable } from "rxjs";

const API_PATH = "/transactions";

export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsSubject.asObservable();
  }

  async fetchTransactions(): Promise<void> {
    try {
      const response = await api.get<Transaction[]>(API_PATH);
      this.transactionsSubject.next(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  async addTransaction(newTransaction: CreateTransactionDto): Promise<void> {
    try {
      await api.post(API_PATH, newTransaction);
      await this.fetchTransactions(); // Aktualisiere die Liste nach dem Hinzufügen
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  }

  async updateTransaction(
    transactionId: string,
    updatedTransaction: UpdateTransactionDto
  ): Promise<void> {
    try {
      await api.put(`${API_PATH}/${transactionId}`, updatedTransaction);
      await this.fetchTransactions(); // Aktualisiere die Liste nach dem Update
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await api.delete(`${API_PATH}/${transactionId}`);
      await this.fetchTransactions(); // Aktualisiere die Liste nach dem Löschen
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();
