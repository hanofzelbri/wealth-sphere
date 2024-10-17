import { Investment, Transaction } from "@/types";

class PortfolioService {
  private investments: Investment[] = [
    {
      id: "1",
      name: "Bitcoin",
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

  async getInvestments(): Promise<Investment[]> {
    return Promise.resolve(this.investments);
  }

  async addInvestment(newInvestment: Omit<Investment, 'id'>): Promise<Investment> {
    const investment: Investment = {
      ...newInvestment,
      id: Date.now().toString(),
      transactions: []
    };
    this.investments.push(investment);
    return Promise.resolve(investment);
  }

  async updateInvestment(updatedInvestment: Investment): Promise<Investment> {
    const index = this.investments.findIndex(inv => inv.id === updatedInvestment.id);
    if (index !== -1) {
      this.investments[index] = updatedInvestment;
    }
    return Promise.resolve(updatedInvestment);
  }

  async deleteInvestment(id: string): Promise<void> {
    const index = this.investments.findIndex(inv => inv.id === id);
    if (index !== -1) {
      this.investments.splice(index, 1);
    }
    return Promise.resolve();
  }

  async addTransaction(investmentId: string, newTransaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const investment = this.investments.find(inv => inv.id === investmentId);
    if (investment) {
      const transaction: Transaction = {
        ...newTransaction,
        id: Date.now().toString()
      };
      investment.transactions.push(transaction);
      return Promise.resolve(transaction);
    }
    throw new Error("Investment not found");
  }

  async getInvestmentById(id: string): Promise<Investment | null> {
    const investment = this.investments.find(inv => inv.id === id);
    return Promise.resolve(investment || null);
  }
}

export const portfolioService = new PortfolioService();

export const getInvestments = async (): Promise<Investment[]> => {
  return portfolioService.getInvestments();
};

export const getInvestmentById = async (id: string): Promise<Investment | null> => {
  return portfolioService.getInvestmentById(id);
};

export const addInvestment = async (newInvestment: Omit<Investment, 'id'>): Promise<Investment> => {
  return portfolioService.addInvestment(newInvestment);
};

export const updateInvestment = async (updatedInvestment: Investment): Promise<Investment> => {
  return portfolioService.updateInvestment(updatedInvestment);
};

export const deleteInvestment = async (id: string): Promise<void> => {
  return portfolioService.deleteInvestment(id);
};

export const addTransaction = async (investmentId: string, newTransaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  return portfolioService.addTransaction(investmentId, newTransaction);
};
