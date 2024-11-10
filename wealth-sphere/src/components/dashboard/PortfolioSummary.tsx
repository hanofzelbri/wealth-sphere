import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PerformerCard } from "./PerformerCard";
import {
  calculateProfitLoss,
  formatNumber,
} from "@/utils/investmentCalculations";
import { LoadingState } from "../utils/LoadingState";
import { InvestmentEntity } from "@/api-client/types.gen";
import { useQuery } from "@tanstack/react-query";
import { investmentsControllerGetAllInvestmentsOptions } from "@/api-client/@tanstack/react-query.gen";

interface Performer {
  investment: InvestmentEntity;
  profitLoss: number;
  profitLossPercentage: number;
}

export const PortfolioSummary: React.FC = () => {
  const investments = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });

  const { totalValue, totalGainLoss, bestPerformer, worstPerformer } =
    useMemo(() => {
      if (!investments.isSuccess) return {};

      let value = 0;
      let gainLoss = 0;
      let best: Performer | null = null;
      let worst: Performer | null = null;

      investments.data.forEach((inv) => {
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
        image={performer.investment.image}
        name={performer.investment.name}
        value={performer.profitLoss}
        percentage={performer.profitLossPercentage}
      />
    );
  };

  if (investments.isLoading) return <LoadingState />;
  if (investments.isError) return <p>Error: {investments.error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6 text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            All-time profit
          </h3>
          <div
            className={`text-2xl font-semibold ${
              (totalGainLoss ?? 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${formatNumber(Math.abs(totalGainLoss ?? 0))}
          </div>
          <div
            className={`flex items-center text-sm justify-center ${
              (totalGainLoss ?? 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalGainLoss ?? 0 >= 0 ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {totalValue
              ? formatNumber(
                  (totalGainLoss / (totalValue - totalGainLoss)) * 100
                )
              : "0.00"}
            %
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Portfolio Value
          </h3>
          <div className="text-2xl font-semibold">
            ${formatNumber(totalValue || 0)}
          </div>
        </CardContent>
      </Card>
      {renderPerformanceCard(bestPerformer || null, "Best Performer")}
      {renderPerformanceCard(worstPerformer || null, "Worst Performer")}
    </div>
  );
};
