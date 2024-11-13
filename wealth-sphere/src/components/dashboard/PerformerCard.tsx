import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GainLossDisplay } from "../utils/GainLossDisplay";

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
          <span className="text-xl font-semibold">{name}</span>
        </div>
        <div className="flex justify-center">
          <GainLossDisplay value={value} percentage={percentage} />
        </div>
      </CardContent>
    </Card>
  );
};
