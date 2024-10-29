import { BehaviorSubject, Observable } from "rxjs";
import { Investment } from "@/types/types";
import { ApiService, API_BASE_URL } from "./api.service";
import axios from "axios";

const API_URL = `${API_BASE_URL}/investments`;

export class InvestmentService extends ApiService {
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
      const response = await axios.get<Investment[]>(
        API_URL,
        this.getHeaders()
      );
      this.investmentsSubject.next(response.data);
    } catch (error) {
      this.handleError(error, "Error fetching investments");
    }
  }

  async fetchInvestmentById(id: string): Promise<void> {
    try {
      const response = await axios.get<Investment>(
        `${API_URL}/${id}`,
        this.getHeaders()
      );
      this.currentInvestmentSubject.next(response.data);
    } catch (error) {
      this.handleError(error, `Error fetching investment with id ${id}`);
    }
  }

  async fetchInvestmentBySymbol(symbol: string): Promise<Investment | null> {
    try {
      const response = await axios.get<Investment>(
        `${API_URL}/symbol/${symbol}`,
        this.getHeaders()
      );
      if (response.data) {
        this.currentInvestmentSubject.next(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      this.handleError(error, "Error fetching investment by symbol");
    }
  }

  async addInvestment(
    newInvestment: Omit<
      Investment,
      "id" | "transactions" | "storages" | "stakings"
    >
  ): Promise<void> {
    try {
      await axios.post(API_URL, newInvestment, this.getHeaders());
      await this.fetchInvestments();
    } catch (error) {
      this.handleError(error, "Error adding investment");
    }
  }

  async updateInvestment(investment: Investment): Promise<void> {
    try {
      await axios.put(
        `${API_URL}/${investment.id}`,
        investment,
        this.getHeaders()
      );
      await this.fetchInvestments();
    } catch (error) {
      this.handleError(error, "Error updating investment");
    }
  }

  async deleteInvestment(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, this.getHeaders());
      await this.fetchInvestments();
    } catch (error) {
      this.handleError(error, "Error deleting investment");
    }
  }
}

export const investmentService = new InvestmentService();
