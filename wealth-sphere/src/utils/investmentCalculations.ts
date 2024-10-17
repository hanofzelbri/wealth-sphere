import { Transaction } from "../types";

export function calculateAverageBuyingPrice(
  transactions: Transaction[]
): number {
  const buyTransactions = transactions.filter((t) => t.type === "buy");
  const totalCost = buyTransactions.reduce(
    (sum, t) => sum + t.price * t.quantity,
    0
  );
  const totalQuantity = buyTransactions.reduce((sum, t) => sum + t.quantity, 0);
  return totalQuantity > 0 ? totalCost / totalQuantity : 0;
}

export function calculateProfitLoss(
  transactions: Transaction[],
  currentPrice: number
): { profitLoss: number; profitLossPercentage: number } {
  const buyTransactions = transactions.filter((t) => t.type === "buy");
  const sellTransactions = transactions.filter((t) => t.type === "sell");

  const totalBuyQuantity = buyTransactions.reduce(
    (sum, t) => sum + t.quantity,
    0
  );
  const totalSellQuantity = sellTransactions.reduce(
    (sum, t) => sum + t.quantity,
    0
  );
  const currentQuantity = totalBuyQuantity - totalSellQuantity;

  const totalCost = buyTransactions.reduce(
    (sum, t) => sum + t.price * t.quantity,
    0
  );
  const totalSellValue = sellTransactions.reduce(
    (sum, t) => sum + t.price * t.quantity,
    0
  );
  const currentValue = currentQuantity * currentPrice;

  const profitLoss = currentValue + totalSellValue - totalCost;
  const profitLossPercentage = (profitLoss / totalCost) * 100;

  return { profitLoss, profitLossPercentage };
}

export const calculateTotalHolding = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === 'buy') {
      return total + transaction.quantity;
    } else if (transaction.type === 'sell') {
      return total - transaction.quantity;
    }
    return total;
  }, 0);
};
