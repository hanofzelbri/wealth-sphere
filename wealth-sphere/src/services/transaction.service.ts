import { ApiService, API_BASE_URL } from "./api.service";
import axios from "axios";
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from "@/types/transaction.types";
import { BehaviorSubject, Observable } from "rxjs";

const API_URL = `${API_BASE_URL}/transactions`;

export class TransactionService extends ApiService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsSubject.asObservable();
  }

  async fetchTransactions(): Promise<void> {
    try {
      const response = await axios.get<Transaction[]>(
        `${API_URL}`,
        this.getHeaders()
      );
      this.transactionsSubject.next(response.data);
    } catch (error) {
      this.handleError(error, "Error fetching transactions");
    }
  }

  async addTransaction(newTransaction: CreateTransactionDto): Promise<void> {
    try {
      await axios.post(`${API_URL}`, newTransaction, this.getHeaders());
      await this.fetchTransactions();
    } catch (error) {
      this.handleError(error, "Error adding transaction");
    }
  }

  async updateTransaction(
    transactionId: string,
    updatedTransaction: UpdateTransactionDto
  ): Promise<void> {
    try {
      await axios.put(
        `${API_URL}/${transactionId}`,
        updatedTransaction,
        this.getHeaders()
      );
      await this.fetchTransactions();
    } catch (error) {
      this.handleError(error, "Error updating transaction");
    }
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${transactionId}`, this.getHeaders());
      await this.fetchTransactions();
    } catch (error) {
      this.handleError(error, "Error deleting transaction");
    }
  }
}

export const transactionService = new TransactionService();
