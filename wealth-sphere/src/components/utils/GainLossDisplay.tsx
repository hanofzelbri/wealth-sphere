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
    <div
      className={`flex ${
        vertical ? "flex-col items-start" : "flex-row"
      } gap-2 text-sm ${
        isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      <span>${formatNumber(Math.abs(value))}</span>
      {vertical ? (
        <div className="flex items-center">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : value < 0 ? (
            <ArrowDownRight className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          {formatNumber(Math.abs(percentage))}%
        </div>
      ) : (
        <>
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : value < 0 ? (
            <ArrowDownRight className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          {formatNumber(Math.abs(percentage))}%
        </>
      )}
    </div>
  );
};
