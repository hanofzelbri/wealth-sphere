import { Investment, Transaction } from "@/types";
import { BehaviorSubject, Observable } from "rxjs";

class PortfolioService {
  private investments: Investment[] = [
    {
      id: "1",
      name: "Bitcoin",
      symbol: "BTC",
      currentPrice: 35000,
      transactions: [
        {
          id: "1",
          quantity: 1,
          price: 29000,
          date: "2023-01-15",
          type: "buy",
        },
        {
          id: "2",
          quantity: 0.5,
          price: 32000,
          date: "2023-03-20",
          type: "buy",
        },
      ],
    },
    {
      id: "2",
      name: "Ethereum",
      symbol: "ETH",
      currentPrice: 2200,
      transactions: [
        {
          id: "3",
          quantity: 5,
          price: 1800,
          date: "2023-02-10",
          type: "buy",
        },
        {
          id: "4",
          quantity: 5,
          price: 2200,
          date: "2023-04-05",
          type: "buy",
        },
      ],
    },
    {
      id: "3",
      name: "Cardano",
      symbol: "ADA",
      currentPrice: 1.5,
      transactions: [
        {
          id: "5",
          quantity: 1000,
          price: 1.2,
          date: "2023-03-01",
          type: "buy",
        },
      ],
    },
  ];

  private investmentsSubject = new BehaviorSubject<Investment[]>(
    this.investments
  );
  private currentInvestmentSubject = new BehaviorSubject<Investment | null>(
    null
  );

  getInvestments(): Observable<Investment[]> {
    return this.investmentsSubject.asObservable();
  }

  getCurrentInvestment(): Observable<Investment | null> {
    return this.currentInvestmentSubject.asObservable();
  }

  async fetchInvestmentById(id: string): Promise<void> {
    const investment = this.investments.find((inv) => inv.id === id);
    this.currentInvestmentSubject.next(investment || null);
  }

  async addTransaction(
    investmentId: string,
    newTransaction: Omit<Transaction, "id">
  ): Promise<void> {
    const investment = this.investments.find((inv) => inv.id === investmentId);
    if (investment) {
      const transaction: Transaction = {
        ...newTransaction,
        id: Date.now().toString(),
      };
      investment.transactions.push(transaction);
      this.investmentsSubject.next([...this.investments]);
      this.currentInvestmentSubject.next({ ...investment });
    } else {
      throw new Error("Investment not found");
    }
  }

  async updateInvestment(updatedInvestment: Investment): Promise<void> {
    const index = this.investments.findIndex(
      (inv) => inv.id === updatedInvestment.id
    );
    if (index !== -1) {
      this.investments[index] = updatedInvestment;
      this.investmentsSubject.next([...this.investments]);
      this.currentInvestmentSubject.next({ ...updatedInvestment });
    }
  }

  async addInvestment(
    newInvestment: Omit<Investment, "id">
  ): Promise<Investment> {
    const investment: Investment = {
      ...newInvestment,
      id: Date.now().toString(),
      transactions: [],
    };
    this.investments.push(investment);
    this.investmentsSubject.next([...this.investments]);
    return Promise.resolve(investment);
  }

  async deleteInvestment(id: string): Promise<void> {
    const index = this.investments.findIndex((inv) => inv.id === id);
    if (index !== -1) {
      this.investments.splice(index, 1);
      this.investmentsSubject.next([...this.investments]);
    }
    return Promise.resolve();
  }

  async getInvestmentById(id: string): Promise<Investment | null> {
    const investment = this.investments.find((inv) => inv.id === id);
    return Promise.resolve(investment || null);
  }

  getInvestmentCount(): number {
    return this.investments.length;
  }

  getBestPerformer(): Investment | null {
    if (this.investments.length === 0) return null;
    return this.investments.reduce((best, current) => {
      const bestPerformance = this.calculatePerformance(best);
      const currentPerformance = this.calculatePerformance(current);
      return currentPerformance > bestPerformance ? current : best;
    });
  }

  getWorstPerformer(): Investment | null {
    if (this.investments.length === 0) return null;
    return this.investments.reduce((worst, current) => {
      const worstPerformance = this.calculatePerformance(worst);
      const currentPerformance = this.calculatePerformance(current);
      return currentPerformance < worstPerformance ? current : worst;
    });
  }

  private calculatePerformance(investment: Investment): number {
    const totalQuantity = investment.transactions.reduce((sum, t) => sum + (t.type === 'buy' ? t.quantity : -t.quantity), 0);
    const currentValue = totalQuantity * investment.currentPrice;
    const costBasis = investment.transactions.reduce((sum, t) => sum + (t.type === 'buy' ? t.quantity * t.price : 0), 0);
    return (currentValue - costBasis) / costBasis;
  }
}

export const portfolioService = new PortfolioService();

export const getInvestments = async (): Promise<{ investments: Investment[] }> => {
  try {
    // Use the mock data directly instead of making an API call
    const investments = await portfolioService.getInvestments().toPromise();
    return { investments: investments || [] };
  } catch (error) {
    console.error('Error fetching investments:', error);
    throw error;
  }
};

export const getCurrentInvestment = (): Observable<Investment | null> => {
  return portfolioService.getCurrentInvestment();
};

export const fetchInvestmentById = async (id: string): Promise<void> => {
  return portfolioService.fetchInvestmentById(id);
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

export const getInvestmentCount = (): number => {
  return portfolioService.getInvestmentCount();
};

export const getBestPerformer = (): Investment | null => {
  return portfolioService.getBestPerformer();
};

export const getWorstPerformer = (): Investment | null => {
  return portfolioService.getWorstPerformer();
};
