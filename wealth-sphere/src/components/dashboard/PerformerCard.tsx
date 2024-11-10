import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatNumber } from "@/utils/investmentCalculations";

interface PerformerCardProps {
  title: string;
  image: string;
  name: string;
  value: number;
  percentage: number;
}

export const PerformerCard: React.FC<PerformerCardProps> = ({
  title,
  image,
  name,
  value,
  percentage,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-gray-500 text-center mb-2">
          {title}
        </h3>
        <div className="flex items-center gap-2 justify-center">
          <img
            src={image}
            alt={`${name} image`}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-2xl font-semibold">{name}</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-1">
          <span
            className={`text-sm ${
              value >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <span className="mr-1">
              {value > 0 ? "+" : value < 0 ? "-" : ""}
            </span>
            ${formatNumber(Math.abs(value))}
          </span>
          <div
            className={`flex items-center text-sm ${
              value >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {value > 0 ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : value < 0 ? (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-1" />
            )}
            {formatNumber(Math.abs(percentage))}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
