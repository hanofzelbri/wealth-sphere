import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  calculateAverageBuyingPrice,
  calculateProfitLoss,
  calculateTotalHolding,
  calculateTotalStaking as calculateStakedUnits,
  storageLocationPercentage,
  formatNumber,
} from "@/utils/investmentCalculations";
import { InvestmentEntity } from "@/api-client/types.gen";

interface InvestmentSummaryProps {
  investment: InvestmentEntity;
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
          <p className="text-xl font-semibold">{formatNumber(totalHolding)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Holding Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">${formatNumber(currentValue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Average Buying Price</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">
            ${formatNumber(averageBuyingPrice)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-xl font-semibold ${
              profitLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${formatNumber(Math.abs(profitLoss))} (
            {formatNumber(profitLossPercentage)}%)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Staked Units</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{formatNumber(stakedUnits)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Staked Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">${formatNumber(stakedValue)}</p>
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
              <span>{formatNumber(hardwarePercentage)}%</span>
            </div>
          )}

          {softwarePercentage > 0 && (
            <div className="flex space-x-2 items-center">
              <span className="font-semibold">Software:</span>
              <span>{formatNumber(softwarePercentage)}%</span>
            </div>
          )}

          {exchangePercentage > 0 && (
            <div className="flex space-x-2 items-center">
              <span className="font-semibold">Exchange:</span>
              <span>{formatNumber(exchangePercentage)}%</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
