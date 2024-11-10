import { InvestmentEntity, StakingEntity, storageLocationType, TransactionEntity } from "@/api-client/types.gen";

export function formatNumber(value: number): string {
  if (Math.abs(value) < 1) {
    return value.toFixed(5);
  }
  return value.toFixed(2);
}

export const calculateAverageBuyingPrice = (
  transactions: TransactionEntity[] = []
): number => {
  const buyTransactions = transactions.filter((t) => t.type === "buy");
  if (!buyTransactions.length) return 0;

  const totalCost = buyTransactions.reduce(
    (sum, t) => sum + t.price * t.quantity,
    0
  );
  const totalAmount = buyTransactions.reduce((sum, t) => sum + t.quantity, 0);

  return totalAmount ? totalCost / totalAmount : 0;
};

export function calculateProfitLoss(
  transactions: TransactionEntity[],
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

export const calculateTotalHolding = (
  transactions: TransactionEntity[]
): number => {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "buy") {
      return total + transaction.quantity;
    } else if (transaction.type === "sell") {
      return total - transaction.quantity;
    }
    return total;
  }, 0);
};

export const calculateTotalStaking = (stakings: StakingEntity[]): number => {
  return stakings.reduce((total, staking) => total + staking.amount, 0);
};
export const calculateStorageLocationPercentageStakings = (
  investment: InvestmentEntity,
  storageLocationType: storageLocationType
): { total: number; percentage: number; storageLocationAmount: number } => {
  const { totalAmount, storageLocationAmount } = investment.stakings.reduce(
    ({ totalAmount, storageLocationAmount }, staking) => {
      totalAmount += staking.amount;
      if (staking.location.storageLocationType === storageLocationType) {
        storageLocationAmount += staking.amount;
      }
      return { totalAmount, storageLocationAmount };
    },
    { totalAmount: 0, storageLocationAmount: 0 }
  );

  const percentage = totalAmount === 0 ? 0 : (storageLocationAmount / totalAmount) * 100;

  return { total: totalAmount, percentage, storageLocationAmount };
};

export const calculateStorageLocationPercentageStorages = (
  investment: InvestmentEntity,
  storageLocationType: storageLocationType
): { total: number; percentage: number; storageLocationAmount: number } => {
  const { totalAmount, storageLocationAmount } = investment.storages.reduce(
    ({ totalAmount, storageLocationAmount }, storage) => {
      totalAmount += storage.amount;
      if (storage.location.storageLocationType === storageLocationType) {
        storageLocationAmount += storage.amount;
      }
      return { totalAmount, storageLocationAmount };
    },
    { totalAmount: 0, storageLocationAmount: 0 }
  );

  const percentage = totalAmount === 0 ? 0 : (storageLocationAmount / totalAmount) * 100;

  return { total: totalAmount, percentage, storageLocationAmount };
};

export const storageLocationPercentage = (
  investment: InvestmentEntity,
  storageLocationType: storageLocationType
): number => {
  const staking = calculateStorageLocationPercentageStakings(
    investment,
    storageLocationType
  );
  const storage = calculateStorageLocationPercentageStorages(
    investment,
    storageLocationType
  );

  const total = storage.total + staking.total;
  const storageLocationAmount = storage.storageLocationAmount + staking.storageLocationAmount;

  return storageLocationAmount === 0 ? 0 : total / storageLocationAmount * 100;
};
