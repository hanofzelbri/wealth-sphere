import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { blockchainCenterControllerGetAltcoinSeasonIndexOptions } from "@/api-client/@tanstack/react-query.gen";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "../utils/LoadingState";

export const AltcoinSeasonIndex: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    ...blockchainCenterControllerGetAltcoinSeasonIndexOptions(),
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  if (isLoading) return <LoadingState />;
  if (isError) return null;
  if (!data) return null;

  const getSeasonText = (value: number) => {
    if (value <= 20) return "Strong Bitcoin Season";
    if (value <= 40) return "Bitcoin Season";
    if (value <= 60) return "Neutral";
    if (value <= 80) return "Altcoin Season";
    return "Strong Altcoin Season";
  };

  const getProgressColor = (value: number) => {
    if (value <= 20) return "[&>*]:bg-red-500";
    if (value <= 40) return "[&>*]:bg-orange-500";
    if (value <= 60) return "[&>*]:bg-yellow-500";
    if (value <= 80) return "[&>*]:bg-green-500";
    return "[&>*]:bg-emerald-500";
  };

  const SeasonIndicator = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-lg font-bold flex items-center gap-2">
            {getSeasonText(value)}
            <span className="text-sm text-muted-foreground">({label})</span>
          </span>
        </div>
        <span className="text-lg font-semibold">{Math.round(value)}%</span>
      </div>
      <Progress value={value} className={`h-2.5 ${getProgressColor(value)}`} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Bitcoin</span>
        <span>Neutral</span>
        <span>Altcoin</span>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Market Season Index
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SeasonIndicator value={data.altcoinSeason ?? 0} label="90d" />
          <SeasonIndicator value={data.month ?? 0} label="30d" />
          <SeasonIndicator value={data.year ?? 0} label="365d" />
        </div>
      </CardContent>
    </Card>
  );
};
