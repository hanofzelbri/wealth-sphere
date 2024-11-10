import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { coingeckoControllerGetMarketChartDataOptions } from "@/api-client/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatNumber } from "@/utils/investmentCalculations";

Chart.register(...registerables);

interface PortfolioChartProps {
  coinId: string;
}

const timeFrames = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 89 },
  { label: "All", days: 3650 },
];

const PortfolioChart: React.FC<PortfolioChartProps> = ({ coinId }) => {
  const [selectedDays, setSelectedDays] = useState<number>(30);

  const { data } = useQuery({
    ...coingeckoControllerGetMarketChartDataOptions({
      path: { coinId },
      query: { days: selectedDays },
    }),
  });

  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      fill: boolean;
      pointRadius: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: "Price",
        data: [],
        backgroundColor: "#16c78415",
        borderColor: "#16c784",
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
      },
    ],
  });

  useEffect(() => {
    if (!data) return;

    const labels = data.map((item) => {
      if (selectedDays > 1) {
        return format(new Date(item.timestamp), "d MMM");
      }
      return format(new Date(item.timestamp), "HH:mm");
    });
    const prices = data.map((item) => item.price);

    setChartData({
      labels,
      datasets: [
        {
          label: "Price",
          data: prices,
          backgroundColor: "#16c78415",
          borderColor: "#16c784",
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
        },
      ],
    });
  }, [data, selectedDays]);

  const percentageChange =
    data && data.length > 1
      ? ((data[data.length - 1].price - data[0].price) / data[0].price) * 100
      : 0;

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center justify-center space-x-2">
          <h2 className="text-2xl font-bold">History</h2>
          <span
            className={
              percentageChange >= 0 ? "text-green-600" : "text-red-600"
            }
          >
            {data && data.length > 1
              ? `( ${formatNumber(percentageChange)}% )`
              : "N/A"}
          </span>
        </div>
        <div className="flex space-x-2">
          {timeFrames.map((timeFrame) => (
            <Button
              key={timeFrame.label}
              variant={selectedDays === timeFrame.days ? "outline" : "default"}
              onClick={() => setSelectedDays(timeFrame.days)}
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
            title: {
              display: false,
            },
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              mode: "index",
              intersect: false,
              callbacks: {
                title: (tooltipItem) => {
                  const timestamp =
                    data?.[tooltipItem[0].dataIndex]?.timestamp?.toString();
                  const date = timestamp ? new Date(timestamp) : new Date();
                  const formattedDate = date.toLocaleDateString();
                  const formattedTime = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return `${formattedDate} ${formattedTime}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "#E0E0E0",
                drawOnChartArea: true,
              },
              ticks: {
                color: "#333",
                autoSkip: true,
                maxTicksLimit: 10,
              },
            },
            y: {
              grid: {
                color: "#E0E0E0",
              },
              ticks: {
                color: "#333",
                callback: (value) => `$${value}`,
              },
              beginAtZero: false,
              position: "right",
            },
          },
        }}
      />
    </div>
  );
};

export default PortfolioChart;
