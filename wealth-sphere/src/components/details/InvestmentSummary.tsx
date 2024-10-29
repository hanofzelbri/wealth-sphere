import React from "react";
import { Investment } from "../../types/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  calculateAverageBuyingPrice,
  calculateProfitLoss,
  calculateTotalHolding,
} from "@/utils/investmentCalculations";

interface InvestmentSummaryProps {
  investment: Investment;
}

export const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({
  investment,
}) => {
  const averageBuyingPrice = calculateAverageBuyingPrice(
    investment.transactions
  );
  const { profitLoss, profitLossPercentage } = calculateProfitLoss(
    investment.transactions,
    investment.currentPrice
  );
  const totalHolding = calculateTotalHolding(investment.transactions);
  const currentValue = totalHolding * investment.currentPrice;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-semibold ${
              profitLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${Math.abs(profitLoss).toFixed(2)} (
            {profitLossPercentage.toFixed(2)}%)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Holding Units</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{totalHolding.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Holding Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">${currentValue.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Average Buying Price</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            ${averageBuyingPrice.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
