"use client";

import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Mock data structure
const allocationData = [
  {
    name: "SOL",
    value: 17081.64,
    ratio: 71.26,
    symbol: "SOL",
    fullName: "Solana",
  },
  {
    name: "INJ",
    value: 2821.64,
    ratio: 11.77,
    symbol: "INJ",
    fullName: "Injective",
  },
  {
    name: "AVAX",
    value: 2118.84,
    ratio: 8.84,
    symbol: "AVAX",
    fullName: "Avalanche",
  },
  {
    name: "NEAR",
    value: 1366.32,
    ratio: 5.7,
    symbol: "NEAR",
    fullName: "NEAR Protocol",
  },
  {
    name: "CELR",
    value: 259.2,
    ratio: 1.08,
    symbol: "CELR",
    fullName: "Celer Network",
  },
  {
    name: "GLMR",
    value: 146.02,
    ratio: 0.61,
    symbol: "GLMR",
    fullName: "Moonbeam",
  },
  {
    name: "SNX",
    value: 67.72,
    ratio: 0.28,
    symbol: "SNX",
    fullName: "Synthetix",
  },
  {
    name: "AUDIO",
    value: 54.91,
    ratio: 0.23,
    symbol: "AUDIO",
    fullName: "Audius",
  },
  {
    name: "ALGO",
    value: 53.74,
    ratio: 0.22,
    symbol: "ALGO",
    fullName: "Algorand",
  },
];

export default function AllocationChart() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const topTokens = allocationData.slice(0, 7);
  const restTokens = allocationData.slice(7);
  const restRatio = restTokens.reduce((acc, token) => acc + token.ratio, 0);

  const chartData = {
    labels: [
      ...topTokens.map(
        (token) => `${token.symbol} (${token.ratio.toFixed(2)}%)`
      ),
      `Rest (${restRatio.toFixed(2)}%)`,
    ],
    datasets: [
      {
        data: [...topTokens.map((token) => token.ratio), restRatio],
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
            {allocationData.map((token) => (
              <div
                key={token.name}
                className="grid grid-cols-3 items-center px-4 py-2 hover:bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10" />
                  <div>
                    <div className="font-medium">{token.fullName}</div>
                    <div className="text-sm text-muted-foreground">
                      {token.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  $
                  {token.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-right font-mono">
                  {token.ratio.toFixed(2)}%
                </div>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
