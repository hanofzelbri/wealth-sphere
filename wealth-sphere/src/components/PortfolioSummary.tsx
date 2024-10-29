import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { PerformerCard } from "./PerformerCard";
import { Investment } from "../types/types";
import { calculateProfitLoss } from "@/utils/investmentCalculations";

interface PortfolioSummaryProps {
  investments: Investment[];
}

interface Performer {
  investment: Investment;
  profitLoss: number;
  profitLossPercentage: number;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  investments,
}) => {
  const { totalValue, totalGainLoss, bestPerformer, worstPerformer } =
    useMemo(() => {
      let value = 0;
      let gainLoss = 0;
      let best: Performer | null = null;
      let worst: Performer | null = null;

      investments.forEach((inv) => {
        const totalQuantity = inv.transactions.reduce(
          (sum, t) => sum + (t.type === "buy" ? t.quantity : -t.quantity),
          0
        );
        const investmentValue = totalQuantity * inv.currentPrice;
        const costBasis = inv.transactions.reduce(
          (sum, t) => sum + (t.type === "buy" ? t.quantity * t.price : 0),
          0
        );
        value += investmentValue;
        gainLoss += investmentValue - costBasis;

        const { profitLoss, profitLossPercentage } = calculateProfitLoss(
          inv.transactions,
          inv.currentPrice
        );
        const performer: Performer = {
          investment: inv,
          profitLoss,
          profitLossPercentage,
        };

        if (!best || profitLossPercentage > best.profitLossPercentage) {
          best = performer;
        }
        if (!worst || profitLossPercentage < worst.profitLossPercentage) {
          worst = performer;
        }
      });

      return {
        totalValue: value,
        totalGainLoss: gainLoss,
        bestPerformer: best,
        worstPerformer: worst,
      };
    }, [investments]);

  const renderPerformanceCard = (
    performer: Performer | null,
    title: string
  ) => {
    if (!performer) return null;
    return (
      <PerformerCard
        title={title}
        symbol={performer.investment.symbol}
        name={performer.investment.name}
        value={performer.profitLoss}
        percentage={performer.profitLossPercentage}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            All-time profit
          </h3>
          <div
            className={`text-2xl font-semibold ${
              totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${Math.abs(totalGainLoss).toFixed(2)}
          </div>
          <div
            className={`flex items-center text-sm ${
              totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalGainLoss >= 0 ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            {((totalGainLoss / (totalValue - totalGainLoss)) * 100).toFixed(2)}%
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Portfolio Value
          </h3>
          <div className="text-2xl font-semibold">${totalValue.toFixed(2)}</div>
        </CardContent>
      </Card>
      {renderPerformanceCard(bestPerformer, "Best Performer")}
      {renderPerformanceCard(worstPerformer, "Worst Performer")}
    </div>
  );
};
