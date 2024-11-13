import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatNumber } from "@/utils/investmentCalculations";
import { portfolioControllerGetPortfolioHistoryOptions } from "@/api-client/@tanstack/react-query.gen";
import { GainLossDisplay } from "../utils/GainLossDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card and CardContent

Chart.register(...registerables);

const timeFrames = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 89 },
  { label: "All", days: 3650 },
];

export const PortfolioHistoryChart: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<number>(30);

  const { data: portfolioHistory, isLoading } = useQuery({
    ...portfolioControllerGetPortfolioHistoryOptions({
      query: { days: selectedDays },
    }),
  });

  if (isLoading) return <div>Loading...</div>;

  const chartData = {
    labels:
      portfolioHistory?.map((item) => format(new Date(item.date), "d MMM")) ||
      [],
    datasets: [
      {
        label: "Portfolio Value",
        data: portfolioHistory?.map((item) => item.totalValue) || [],
        backgroundColor: "#16c78415",
        borderColor: "#16c784",
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const portfolioValueChange =
    portfolioHistory && portfolioHistory.length > 1
      ? portfolioHistory[portfolioHistory.length - 1].totalValue -
        portfolioHistory[0].totalValue
      : 0;
  const percentageChange =
    portfolioHistory && portfolioHistory.length > 1
      ? (portfolioValueChange / portfolioHistory[0].totalValue) * 100
      : 0;

  return (
    <Card className="h-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Portfolio History</CardTitle>
        <GainLossDisplay
          value={portfolioValueChange}
          percentage={percentageChange}
        />
        <div className="flex space-x-2">
          {timeFrames.map((timeFrame) => (
            <Button
              key={timeFrame.label}
              variant={selectedDays === timeFrame.days ? "outline" : "default"}
              onClick={() => setSelectedDays(timeFrame.days)}
              size="sm"
            >
              {timeFrame.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                  label: (context) => {
                    return `$${formatNumber(context.raw as number)}`;
                  },
                  title: (tooltipItems) => {
                    const date =
                      portfolioHistory?.[tooltipItems[0].dataIndex].date;
                    return date ? format(new Date(date), "PPpp") : "";
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 8,
                },
              },
              y: {
                position: "right",
                grid: {
                  color: "#e0e0e0",
                },
                ticks: {
                  callback: (value) => `$${formatNumber(value as number)}`,
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
