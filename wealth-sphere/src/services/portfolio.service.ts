import { Investment, Transaction } from "@/types";
import { BehaviorSubject, Observable, firstValueFrom } from "rxjs";
import axios from "axios";
import { userService } from "./user.service";

const API_URL = "http://localhost:3000/investments";

class PortfolioService {
  private investmentsSubject = new BehaviorSubject<Investment[]>([]);
  private currentInvestmentSubject = new BehaviorSubject<Investment | null>(
    null
  );

  private getHeaders(): { headers: { Authorization: string } } {
    const currentUser = userService.currentUserValue;
    return {
      headers: {
        Authorization: `Bearer ${currentUser?.accessToken}`,
      },
    };
  }

  getInvestments(): Observable<Investment[]> {
    return this.investmentsSubject.asObservable();
  }

  getCurrentInvestment(): Observable<Investment | null> {
    return this.currentInvestmentSubject.asObservable();
  }

  async fetchInvestments(): Promise<void> {
    try {
      const headers = this.getHeaders();
      const response = await axios.get<Investment[]>(API_URL, headers);
      this.investmentsSubject.next(response.data);
    } catch (error) {
      console.error("Error fetching investments:", error);
      throw error;
    }
  }

  async fetchInvestmentById(id: string): Promise<void> {
    try {
      const headers = this.getHeaders();
      const response = await axios.get<Investment>(`${API_URL}/${id}`, headers);
      this.currentInvestmentSubject.next(response.data);
    } catch (error) {
      console.error(`Error fetching investment with id ${id}:`, error);
      throw error;
    }
  }

  async addTransaction(
    investmentId: string,
    newTransaction: Omit<Transaction, "id">
  ): Promise<void> {
    try {
      const headers = this.getHeaders();
      await axios.post(
        `${API_URL}/${investmentId}/transactions`,
        newTransaction,
        headers
      );
      await this.fetchInvestments();
      await this.fetchInvestmentById(investmentId);
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  }

  async updateInvestment(updatedInvestment: Investment): Promise<void> {
    try {
      const headers = this.getHeaders();
      await axios.put(
        `${API_URL}/${updatedInvestment.id}`,
        updatedInvestment,
        headers
      );
      await this.fetchInvestments();
      this.currentInvestmentSubject.next(updatedInvestment);
    } catch (error) {
      console.error("Error updating investment:", error);
      throw error;
    }
  }

  async addInvestment(
    newInvestment: Omit<
      Investment,
      "id" | "transactions" | "storages" | "stakings"
    >
  ): Promise<Investment> {
    try {
      const headers = this.getHeaders();
      const response = await axios.post<Investment>(
        API_URL,
        newInvestment,
        headers
      );
      await this.fetchInvestments();
      return response.data;
    } catch (error) {
      console.error("Error adding investment:", error);
      throw error;
    }
  }

  async deleteInvestment(id: string): Promise<void> {
    try {
      const headers = this.getHeaders();
      await axios.delete(`${API_URL}/${id}`, headers);
      await this.fetchInvestments();
    } catch (error) {
      console.error(`Error deleting investment with id ${id}:`, error);
      throw error;
    }
  }

  async getInvestmentById(id: string): Promise<Investment | null> {
    try {
      const headers = this.getHeaders();
      const response = await axios.get<Investment>(`${API_URL}/${id}`, headers);
      return response.data;
    } catch (error) {
      console.error(`Error getting investment with id ${id}:`, error);
      throw error;
    }
  }

  async getInvestmentCount(): Promise<number> {
    try {
      const headers = this.getHeaders();
      const response = await axios.get<number>(`${API_URL}/count`, headers);
      return response.data;
    } catch (error) {
      console.error("Error getting investment count:", error);
      throw error;
    }
  }

  async getBestPerformer(): Promise<Investment | null> {
    try {
      const headers = this.getHeaders();
      const response = await axios.get<Investment>(
        `${API_URL}/best-performer`,
        headers
      );
      return response.data;
    } catch (error) {
      console.error("Error getting best performer:", error);
      throw error;
    }
  }

  async getWorstPerformer(): Promise<Investment | null> {
    try {
      const headers = this.getHeaders();
      const response = await axios.get<Investment>(
        `${API_URL}/worst-performer`,
        headers
      );
      return response.data;
    } catch (error) {
      console.error("Error getting worst performer:", error);
      throw error;
    }
  }

  async deleteTransaction(
    investmentId: string,
    transactionId: string
  ): Promise<void> {
    try {
      const headers = this.getHeaders();
      await axios.delete(
        `${API_URL}/${investmentId}/transactions/${transactionId}`,
        headers
      );
      await this.fetchInvestmentById(investmentId);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  async updateTransaction(
    investmentId: string,
    transactionId: string,
    updatedTransaction: Omit<Transaction, "id">
  ): Promise<void> {
    try {
      const headers = this.getHeaders();
      await axios.put(
        `${API_URL}/${investmentId}/transactions/${transactionId}`,
        updatedTransaction,
        headers
      );
      await this.fetchInvestmentById(investmentId);
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }
}

export const portfolioService = new PortfolioService();

export const getInvestments = async (): Promise<{
  investments: Investment[];
}> => {
  await portfolioService.fetchInvestments();
  const investments = await firstValueFrom(portfolioService.getInvestments());
  return { investments };
};

export const getCurrentInvestment = (): Observable<Investment | null> => {
  return portfolioService.getCurrentInvestment();
};

export const fetchInvestmentById = async (id: string): Promise<void> => {
  return portfolioService.fetchInvestmentById(id);
};

export const fetchInvestmentBySymbol = async (
  symbol: string
): Promise<Investment | null> => {
  try {
    const investments = await firstValueFrom(portfolioService.getInvestments());
    const foundInvestment = investments.find(
      (investment) => investment.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (foundInvestment) {
      return foundInvestment;
    }

    return null;
  } catch (error) {
    console.error("Error fetching investment by symbol:", error);
    throw error;
  }
};

export const addTransaction = async (
  investmentId: string,
  newTransaction: Omit<Transaction, "id">
): Promise<void> => {
  return portfolioService.addTransaction(investmentId, newTransaction);
};

export const updateInvestment = async (
  updatedInvestment: Investment
): Promise<void> => {
  return portfolioService.updateInvestment(updatedInvestment);
};

export const addInvestment = async (
  newInvestment: Omit<
    Investment,
    "id" | "transactions" | "storages" | "stakings"
  >
): Promise<Investment> => {
  return portfolioService.addInvestment(newInvestment);
};

export const deleteInvestment = async (id: string): Promise<void> => {
  return portfolioService.deleteInvestment(id);
};

export const getInvestmentById = async (
  id: string
): Promise<Investment | null> => {
  return portfolioService.getInvestmentById(id);
};

export const getInvestmentCount = async (): Promise<number> => {
  return portfolioService.getInvestmentCount();
};

export const getBestPerformer = async (): Promise<Investment | null> => {
  return portfolioService.getBestPerformer();
};

export const getWorstPerformer = async (): Promise<Investment | null> => {
  return portfolioService.getWorstPerformer();
};

export const deleteTransaction = async (
  investmentId: string,
  transactionId: string
): Promise<void> => {
  return portfolioService.deleteTransaction(investmentId, transactionId);
};

export const updateTransaction = async (
  investmentId: string,
  transactionId: string,
  updatedTransaction: Omit<Transaction, "id">
): Promise<void> => {
  return portfolioService.updateTransaction(
    investmentId,
    transactionId,
    updatedTransaction
  );
};
