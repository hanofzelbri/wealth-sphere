import React from "react";
import { Investment } from "../../types/investment.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  calculateAverageBuyingPrice,
  calculateProfitLoss,
  calculateTotalHolding,
  calculateTotalStaking as calculateStakedUnits,
  storageLocationPercentage,
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

  const stakedUnits = calculateStakedUnits(investment.stakings);
  const stakedValue = stakedUnits * investment.currentPrice;

  const hardwarePercentage = storageLocationPercentage(
    investment,
    "hardwareWallet"
  );
  const softwarePercentage = storageLocationPercentage(
    investment,
    "softwareWallet"
  );
  const exchangePercentage = storageLocationPercentage(investment, "exchange");

  return (
    <div className="grid grid-cols-4 gap-4">
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
          <CardTitle className="text-lg">Staked Units</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{stakedUnits.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Staked Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">${stakedValue.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Storage Location</CardTitle>
        </CardHeader>
        <CardContent>
          {hardwarePercentage > 0 && (
            <div className="flex space-x-2 items-center">
              <span className="font-semibold">Hardware:</span>
              <span>{hardwarePercentage.toFixed(2)}%</span>
            </div>
          )}

          {softwarePercentage > 0 && (
            <div className="flex space-x-2 items-center">
              <span className="font-semibold">Software:</span>
              <span>{softwarePercentage.toFixed(2)}%</span>
            </div>
          )}

          {exchangePercentage > 0 && (
            <div className="flex space-x-2 items-center">
              <span className="font-semibold">Exchange:</span>
              <span>{exchangePercentage.toFixed(2)}%</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
