import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface PerformerCardProps {
  title: string;
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  isPositive: boolean;
}

export const PerformerCard: React.FC<PerformerCardProps> = ({ title, symbol, name, value, percentage, isPositive }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold mr-2">{symbol} {name}</span>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : '-'}${Math.abs(value).toFixed(2)}
          </span>
        </div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
          {Math.abs(percentage).toFixed(2)}%
        </div>
      </CardContent>
    </Card>
  );
};
