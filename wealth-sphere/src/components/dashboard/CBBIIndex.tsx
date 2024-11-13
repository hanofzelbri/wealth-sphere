import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "../utils/LoadingState";

interface CBBIData {
  Price: Record<string, number>;
  PiCycle: Record<string, number>;
  RUPL: Record<string, number>;
  RHODL: Record<string, number>;
  Puell: Record<string, number>;
  "2YMA": Record<string, number>;
  Trolololo: Record<string, number>;
  MVRV: Record<string, number>;
  ReserveRisk: Record<string, number>;
  Woobull: Record<string, number>;
  Confidence: Record<string, number>;
}

const fetchCBBIData = async () => {
  const response = await fetch(
    "https://colintalkscrypto.com/cbbi/data/latest.json"
  );
  return (await response.json()) as CBBIData;
};

export const CBBIIndex: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cbbi"],
    queryFn: fetchCBBIData,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  if (isLoading) return <LoadingState />;
  if (isError) return null;
  if (!data) return null;

  const getMarketPhase = (value: number) => {
    if (value <= 30) return "Accumulation Phase";
    if (value <= 50) return "Early Bull Market";
    if (value <= 75) return "Mid Bull Market";
    if (value <= 90) return "Late Bull Market";
    return "Market Top";
  };

  const getProgressColor = (value: number) => {
    if (value <= 30) return "[&>*]:bg-red-500";
    if (value <= 50) return "[&>*]:bg-orange-500";
    if (value <= 75) return "[&>*]:bg-yellow-500";
    if (value <= 90) return "[&>*]:bg-green-500";
    return "[&>*]:bg-emerald-500";
  };

  const currentConfidentLevel =
    Object.values(data.Confidence).slice(-1)[0] * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Bitcoin Bull Run Index (CBBI)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                {getMarketPhase(currentConfidentLevel)}
              </span>
              <span className="text-lg font-semibold">
                {currentConfidentLevel}%
              </span>
            </div>
            <Progress
              value={currentConfidentLevel}
              className={`h-2.5 ${getProgressColor(currentConfidentLevel)}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Accumulation</span>
              <span>Bull Market</span>
              <span>Market Top</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
