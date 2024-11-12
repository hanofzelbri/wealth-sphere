import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatNumber } from "@/utils/investmentCalculations";
import { Card } from "@/components/ui/card";
import { portfolioControllerGetPortfolioHistoryOptions } from "@/api-client/@tanstack/react-query.gen";

Chart.register(...registerables);

const timeFrames = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All", days: 365 },
];

export const PortfolioChart: React.FC = () => {
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

  const percentageChange =
    portfolioHistory && portfolioHistory.length > 1
      ? ((portfolioHistory[portfolioHistory.length - 1].totalValue -
          portfolioHistory[0].totalValue) /
          portfolioHistory[0].totalValue) *
        100
      : 0;

  return (
    <Card className="p-6">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center justify-center space-x-2">
          <h2 className="text-2xl font-bold">Portfolio History</h2>
          <span
            className={
              percentageChange >= 0 ? "text-green-600" : "text-red-600"
            }
          >
            {portfolioHistory && portfolioHistory.length > 1
              ? `(${formatNumber(percentageChange)}%)`
              : "N/A"}
          </span>
        </div>
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
      </div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
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
    </Card>
  );
};
