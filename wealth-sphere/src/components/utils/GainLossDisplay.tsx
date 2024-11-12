import React from "react";
import { ArrowRight, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatNumber } from "@/utils/investmentCalculations";

interface GainLossDisplayProps {
  value: number;
  percentage: number;
  vertical?: boolean;
}

export const GainLossDisplay: React.FC<GainLossDisplayProps> = ({
  value,
  percentage,
  vertical = false,
}) => {
  const isPositive = value >= 0;

  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row"} items-center justify-center gap-4 mt-1`}>
      <div className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
        <span className="mr-1">{value > 0 ? "+" : value < 0 ? "-" : ""}</span>$
        {formatNumber(Math.abs(value))}
      </div>
      <div className={`flex items-center text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 mr-1" />
        ) : value < 0 ? (
          <ArrowDownRight className="w-4 h-4 mr-1" />
        ) : (
          <ArrowRight className="w-4 h-4 mr-1" />
        )}
        {formatNumber(Math.abs(percentage))}%
      </div>
    </div>
  );
};
