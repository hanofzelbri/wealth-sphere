import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useMarketData } from "@/hooks/coingecko";

Chart.register(...registerables);

interface PortfolioChartProps {
  data: { timestamp: number; price: number }[];
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ data: data2 }) => {
  const { data } = useMarketData();

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

    const labels = data[0].timestamps.map((dataPoint) =>
      new Date(dataPoint).toLocaleDateString()
    );
    const prices = data[0].prices.map((dataPoint) => dataPoint);

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
  }, [data]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      {" "}
      {/* Anpassung */}
      <h2 className="text-lg font-semibold mb-4">History</h2> {/* Titel */}
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
                    data?.[0]?.timestamps[tooltipItem[0].dataIndex];
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
              beginAtZero: true,
              position: "right",
            },
          },
        }}
      />
    </div>
  );
};

export default PortfolioChart;
