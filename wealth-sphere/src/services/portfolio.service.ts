import { InvestmentSummary } from '../components/PortfolioDashboard';

const mockPortfolioSummary: InvestmentSummary[] = [
  { symbol: 'BTC', name: 'Bitcoin', totalQuantity: 1.5, averagePurchasePrice: 30000, currentPrice: 35000 },
  { symbol: 'ETH', name: 'Ethereum', totalQuantity: 10, averagePurchasePrice: 2000, currentPrice: 2200 },
  { symbol: 'ADA', name: 'Cardano', totalQuantity: 1000, averagePurchasePrice: 1, currentPrice: 1.2 },
];

const mockPerformanceData = [
  { date: '2023-01-01', value: 50000 },
  { date: '2023-02-01', value: 55000 },
  { date: '2023-03-01', value: 52000 },
  { date: '2023-04-01', value: 58000 },
  { date: '2023-05-01', value: 60000 },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchPortfolioSummary = async (): Promise<InvestmentSummary[]> => {
  await delay(500); // Simulate network delay
  return mockPortfolioSummary;
};

export const fetchInvestmentDetails = async (symbol: string) => {
  await delay(500);
  const investment = mockPortfolioSummary.find(inv => inv.symbol === symbol);
  if (!investment) {
    throw new Error('Investment not found');
  }
  return {
    ...investment,
    transactions: [
      { id: '1', date: '2023-01-15', quantity: investment.totalQuantity / 2, price: investment.averagePurchasePrice * 0.9, type: 'buy' },
      { id: '2', date: '2023-03-20', quantity: investment.totalQuantity / 2, price: investment.averagePurchasePrice * 1.1, type: 'buy' },
    ],
  };
};

export const addInvestment = async (investment: Omit<InvestmentSummary, 'totalQuantity' | 'averagePurchasePrice'> & { quantity: number, purchasePrice: number }) => {
  await delay(500);
  const newInvestment: InvestmentSummary = {
    ...investment,
    totalQuantity: investment.quantity,
    averagePurchasePrice: investment.purchasePrice,
  };
  mockPortfolioSummary.push(newInvestment);
  return newInvestment;
};

export const sellInvestment = async (sale: { symbol: string, quantity: number, sellPrice: number }) => {
  await delay(500);
  const investment = mockPortfolioSummary.find(inv => inv.symbol === sale.symbol);
  if (!investment) {
    throw new Error('Investment not found');
  }
  investment.totalQuantity -= sale.quantity;
  if (investment.totalQuantity <= 0) {
    const index = mockPortfolioSummary.findIndex(inv => inv.symbol === sale.symbol);
    mockPortfolioSummary.splice(index, 1);
  }
  return investment;
};

export const fetchPerformanceData = async () => {
  await delay(500);
  return mockPerformanceData;
};
