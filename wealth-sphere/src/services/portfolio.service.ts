import { Injectable } from "@angular/core";

export interface Stock {
  name: string;
  symbol: string;
  shares: number;
  purchasePrice: number;
}

@Injectable({
  providedIn: "root",
})
export class PortfolioService {
  private portfolio: Stock[] = [
    { name: "Apple Inc.", symbol: "AAPL", shares: 10, purchasePrice: 150 },
    {
      name: "Microsoft Corporation",
      symbol: "MSFT",
      shares: 5,
      purchasePrice: 200,
    },
    {
      name: "Amazon.com, Inc.",
      symbol: "AMZN",
      shares: 2,
      purchasePrice: 3000,
    },
  ];

  private listeners: ((stocks: Stock[]) => void)[] = [];

  portfolio$ = {
    subscribe: (listener: (stocks: Stock[]) => void) => {
      this.listeners.push(listener);
      listener(this.portfolio);
      return {
        unsubscribe: () => {
          this.listeners = this.listeners.filter((l) => l !== listener);
        },
      };
    },
  };

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.portfolio));
  }

  addStock(stock: Stock) {
    this.portfolio = [...this.portfolio, stock];
    this.notifyListeners();
  }

  removeStock(symbol: string) {
    this.portfolio = this.portfolio.filter((stock) => stock.symbol !== symbol);
    this.notifyListeners();
  }

  updateStock(updatedStock: Stock) {
    this.portfolio = this.portfolio.map((stock) =>
      stock.symbol === updatedStock.symbol ? updatedStock : stock
    );
    this.notifyListeners();
  }
}
