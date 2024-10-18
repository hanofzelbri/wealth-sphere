import { Investment, Transaction } from "@/types";
import { BehaviorSubject, Observable } from "rxjs";
import axios from 'axios';

const API_URL = 'http://localhost:3000/investments';

class PortfolioService {
  private investmentsSubject = new BehaviorSubject<Investment[]>([]);
  private currentInvestmentSubject = new BehaviorSubject<Investment | null>(null);

  getInvestments(): Observable<Investment[]> {
    return this.investmentsSubject.asObservable();
  }

  getCurrentInvestment(): Observable<Investment | null> {
    return this.currentInvestmentSubject.asObservable();
  }

  async fetchInvestments(): Promise<void> {
    const response = await axios.get<Investment[]>(API_URL);
    this.investmentsSubject.next(response.data);
  }

  async fetchInvestmentById(id: string): Promise<void> {
    const response = await axios.get<Investment>(`${API_URL}/${id}`);
    this.currentInvestmentSubject.next(response.data);
  }

  async fetchInvestmentBySymbol(symbol: string): Promise<void> {
    const response = await axios.get<Investment>(`${API_URL}/symbol/${symbol}`);
    this.currentInvestmentSubject.next(response.data);
  }

  async addTransaction(
    investmentId: string,
    newTransaction: Omit<Transaction, "id">
  ): Promise<void> {
    await axios.post(`${API_URL}/${investmentId}/transactions`, newTransaction);
    await this.fetchInvestments();
    await this.fetchInvestmentById(investmentId);
  }

  async updateInvestment(updatedInvestment: Investment): Promise<void> {
    await axios.put(`${API_URL}/${updatedInvestment.id}`, updatedInvestment);
    await this.fetchInvestments();
    this.currentInvestmentSubject.next(updatedInvestment);
  }

  async addInvestment(newInvestment: Omit<Investment, "id">): Promise<Investment> {
    const response = await axios.post<Investment>(API_URL, newInvestment);
    await this.fetchInvestments();
    return response.data;
  }

  async deleteInvestment(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
    await this.fetchInvestments();
  }

  async getInvestmentById(id: string): Promise<Investment | null> {
    const response = await axios.get<Investment>(`${API_URL}/${id}`);
    return response.data;
  }

  async getInvestmentCount(): Promise<number> {
    const response = await axios.get<number>(`${API_URL}/count`);
    return response.data;
  }

  async getBestPerformer(): Promise<Investment | null> {
    const response = await axios.get<Investment>(`${API_URL}/best-performer`);
    return response.data;
  }

  async getWorstPerformer(): Promise<Investment | null> {
    const response = await axios.get<Investment>(`${API_URL}/worst-performer`);
    return response.data;
  }
}

export const portfolioService = new PortfolioService();

export const getInvestments = async (): Promise<{ investments: Investment[] }> => {
  await portfolioService.fetchInvestments();
  return { investments: await portfolioService.getInvestments().toPromise() || [] };
};

export const getCurrentInvestment = (): Observable<Investment | null> => {
  return portfolioService.getCurrentInvestment();
};

export const fetchInvestmentById = async (id: string): Promise<void> => {
  return portfolioService.fetchInvestmentById(id);
};

export const fetchInvestmentBySymbol = async (symbol: string): Promise<void> => {
  return portfolioService.fetchInvestmentBySymbol(symbol);
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
  newInvestment: Omit<Investment, "id">
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
