import { Transaction } from "@/types";
import { ApiService, API_BASE_URL } from "./api.service";
import axios from "axios";
import { investmentService } from "./investment.service";

const API_URL = `${API_BASE_URL}/investments`;

export class TransactionService extends ApiService {
  async addTransaction(
    investmentId: string,
    newTransaction: Omit<Transaction, "id">
  ): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/${investmentId}/transactions`,
        newTransaction,
        this.getHeaders()
      );
      await investmentService.fetchInvestmentById(investmentId);
    } catch (error) {
      this.handleError(error, "Error adding transaction");
    }
  }

  async updateTransaction(
    investmentId: string,
    transactionId: string,
    updatedTransaction: Omit<Transaction, "id">
  ): Promise<void> {
    try {
      await axios.put(
        `${API_URL}/${investmentId}/transactions/${transactionId}`,
        updatedTransaction,
        this.getHeaders()
      );
      await investmentService.fetchInvestmentById(investmentId);
    } catch (error) {
      this.handleError(error, "Error updating transaction");
    }
  }

  async deleteTransaction(
    investmentId: string,
    transactionId: string
  ): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/${investmentId}/transactions/${transactionId}`,
        this.getHeaders()
      );
      await investmentService.fetchInvestmentById(investmentId);
    } catch (error) {
      this.handleError(error, "Error deleting transaction");
    }
  }
}

export const transactionService = new TransactionService();
