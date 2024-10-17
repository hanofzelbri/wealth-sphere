import React from 'react';
import { Investment } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateAverageBuyingPrice, calculateProfitLoss, calculateTotalHolding } from '@/utils/investmentCalculations';

interface InvestmentSummaryProps {
  investment: Investment;
}

export const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({ investment }) => {
  const averageBuyingPrice = calculateAverageBuyingPrice(investment.transactions);
  const { profitLoss, profitLossPercentage } = calculateProfitLoss(investment.transactions, investment.currentPrice);
  const totalHolding = calculateTotalHolding(investment.transactions);
  const currentValue = totalHolding * investment.currentPrice;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Buying Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${averageBuyingPrice.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(profitLoss).toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Holding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-semibold">{totalHolding.toFixed(2)} units</p>
            <p className="text-2xl font-semibold">Current Value: ${currentValue.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
