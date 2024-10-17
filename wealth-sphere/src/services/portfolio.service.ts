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
      id: (this.investments.length + 1).toString(),
    };
    this.investments.push(investment);
    return Promise.resolve(investment);
  }

  async updateInvestment(updatedInvestment: Investment): Promise<Investment> {
    const index = this.investments.findIndex(i => i.id === updatedInvestment.id);
    if (index !== -1) {
      this.investments[index] = updatedInvestment;
      return Promise.resolve(updatedInvestment);
    }
    throw new Error("Investment not found");
  }

  async deleteInvestment(id: string): Promise<void> {
    const index = this.investments.findIndex(i => i.id === id);
    if (index !== -1) {
      this.investments.splice(index, 1);
      return Promise.resolve();
    }
    throw new Error("Investment not found");
  }

  async addTransaction(investmentId: string, newTransaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const investment = this.investments.find(i => i.id === investmentId);
    if (investment) {
      const transaction: Transaction = {
        ...newTransaction,
        id: (investment.transactions.length + 1).toString(),
      };
      investment.transactions.push(transaction);
      return Promise.resolve(transaction);
    }
    throw new Error("Investment not found");
  }
}

export const portfolioService = new PortfolioService();

export const getInvestments = (): Promise<Investment[]> => {
  return portfolioService.getInvestments();
};

export const addInvestment = (investment: Omit<Investment, 'id'>): Promise<Investment> => {
  return portfolioService.addInvestment(investment);
};

export const updateInvestment = (investment: Investment): Promise<Investment> => {
  return portfolioService.updateInvestment(investment);
};

export const deleteInvestment = (id: string): Promise<void> => {
  return portfolioService.deleteInvestment(id);
};

export const addTransaction = (investmentId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  return portfolioService.addTransaction(investmentId, transaction);
};
