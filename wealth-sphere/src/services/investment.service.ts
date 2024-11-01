import { api } from "@/lib/api";
import { Investment } from "@/types/investment.types";
import { BehaviorSubject, Observable } from "rxjs";

const API_PATH = "/investments";

export class InvestmentService {
  private investmentsSubject = new BehaviorSubject<Investment[]>([]);
  private currentInvestmentSubject = new BehaviorSubject<Investment | null>(
    null
  );

  getInvestments(): Observable<Investment[]> {
    return this.investmentsSubject.asObservable();
  }

  getCurrentInvestment(): Observable<Investment | null> {
    return this.currentInvestmentSubject.asObservable();
  }

  async fetchInvestments(): Promise<void> {
    try {
      const response = await api.get<Investment[]>(API_PATH);
      this.investmentsSubject.next(response.data);
    } catch (error) {
      console.error("Error fetching investments:", error);
      throw error;
    }
  }

  async fetchInvestmentById(id: string): Promise<void> {
    try {
      const response = await api.get<Investment>(`${API_PATH}/${id}`);
      this.currentInvestmentSubject.next(response.data);
    } catch (error) {
      console.error(`Error fetching investment with id ${id}:`, error);
      throw error;
    }
  }

  async fetchInvestmentBySymbol(symbol: string): Promise<Investment | null> {
    try {
      const response = await api.get<Investment>(
        `${API_PATH}/symbol/${symbol}`
      );
      if (response.data) {
        this.currentInvestmentSubject.next(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching investment by symbol:", error);
      throw error;
    }
  }

  async addInvestment(id: string): Promise<void> {
    try {
      await api.post(API_PATH, { id });
      await this.fetchInvestments();
    } catch (error) {
      console.error("Error adding investment:", error);
      throw error;
    }
  }

  async updateInvestment(investment: Investment): Promise<void> {
    try {
      await api.put(`${API_PATH}/${investment.id}`, investment);
      await this.fetchInvestments();
    } catch (error) {
      console.error("Error updating investment:", error);
      throw error;
    }
  }

  async deleteInvestment(id: string): Promise<void> {
    try {
      await api.delete(`${API_PATH}/${id}`);
      await this.fetchInvestments();
    } catch (error) {
      console.error("Error deleting investment:", error);
      throw error;
    }
  }
}

export const investmentService = new InvestmentService();
