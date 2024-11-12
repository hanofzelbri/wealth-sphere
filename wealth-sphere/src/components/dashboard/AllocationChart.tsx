"use client";

import { useState } from "react";
import { Chart as ChartJS, ArcElement, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { investmentsControllerGetAllInvestmentsOptions } from "@/api-client/@tanstack/react-query.gen";
import { LoadingState } from "../utils/LoadingState";
import {
  calculateTotalHolding,
  formatNumber,
} from "@/utils/investmentCalculations";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

ChartJS.register(ArcElement, Legend, Title);

export default function AllocationChart() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const investments = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });

  if (investments.isLoading) return <LoadingState />;
  if (investments.isError) return <p>Error: {investments.error?.message}</p>;

  let totalPortfolioValue = 0;
  const totalHoldings = investments.data?.map((investment) => {
    const investmentTotalValue =
      calculateTotalHolding(investment.transactions) * investment.currentPrice;
    totalPortfolioValue += investmentTotalValue;
    return {
      investmentId: investment.id,
      symbol: investment.symbol,
      name: investment.name,
      image: investment.image,
      totalValue: investmentTotalValue,
    };
  });

  const percentageHoldings = totalHoldings
    ?.map((holding) => ({
      ...holding,
      percentage: (holding.totalValue / totalPortfolioValue) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  if (!percentageHoldings) return null;

  const topTokens = percentageHoldings.slice(0, 7);
  const restTokens = percentageHoldings.slice(7);
  const restRatio = restTokens.reduce(
    (acc, token) => acc + token.percentage,
    0
  );

  const chartData = {
    labels: [
      ...topTokens.map(
        (token) => `${token.symbol} (${token.percentage.toFixed(2)}%)`
      ),
      `Rest (${restRatio.toFixed(2)}%)`,
    ],
    datasets: [
      {
        data: [...topTokens.map((token) => token.percentage), restRatio],
        backgroundColor: [
          "#3b82f6", // blue
          "#ec4899", // pink
          "#f97316", // orange
          "#eab308", // yellow
          "#06b6d4", // cyan
          "#8b5cf6", // purple
          "#6b7280", // gray
          "#94a3b8", // slate
        ],
        borderWidth: 1,
        borderColor: "transparent",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          padding: 10,
          font: {
            size: 12,
          },
          boxWidth: 15,
          boxHeight: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; parsed: number }) => {
            return `${context.parsed.toFixed(2)}%`;
          },
        },
      },
    },
    cutout: "60%",
    maintainAspectRatio: false,
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">Allocation</h2>
        <Button
          variant="link"
          onClick={() => setIsDialogOpen(true)}
          className="text-primary hover:underline"
        >
          View all
        </Button>
      </div>

      <div className="h-64">
        <Doughnut data={chartData} options={chartOptions} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocation</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] overflow-auto">
            <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground px-4">
              <div>Token</div>
              <div className="text-right">Value</div>
              <div className="text-right">Ratio</div>
            </div>
            {percentageHoldings.map((token) => (
              <div
                key={token.name}
                className="grid grid-cols-3 items-center px-4 py-2 hover:bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={token.image} />
                          <AvatarFallback>{token.symbol}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{token.symbol}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {token.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  ${formatNumber(token.totalValue)}
                </div>
                <div className="text-right font-mono">
                  {token.percentage.toFixed(2)}%
                </div>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
