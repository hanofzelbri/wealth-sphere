import { Transaction } from "@/types/transaction.types";

export const calculateAverageBuyingPrice = (transactions: Transaction[] = []): number => {
  const buyTransactions = transactions.filter(t => t.type === 'BUY');
  if (!buyTransactions.length) return 0;

  const totalCost = buyTransactions.reduce((sum, t) => sum + (t.price * t.amount), 0);
  const totalAmount = buyTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  return totalAmount ? totalCost / totalAmount : 0;
};

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
    if (transaction.type === "buy") {
      return total + transaction.quantity;
    } else if (transaction.type === "sell") {
      return total - transaction.quantity;
    }
    return total;
  }, 0);
};
