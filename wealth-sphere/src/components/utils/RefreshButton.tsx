import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  coingeckoControllerUpdateCoinPricesMutation,
  coingeckoControllerUpdateMarketChartDataMutation,
  investmentsControllerGetAllInvestmentsOptions,
} from "@/api-client/@tanstack/react-query.gen";

const RefreshButton: React.FC = () => {
  const investments = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });
  const updateCoinPrices = useMutation({
    ...coingeckoControllerUpdateCoinPricesMutation(),
  });
  const updateMarketData = useMutation({
    ...coingeckoControllerUpdateMarketChartDataMutation(),
  });

  const isLoading = investments.isLoading;
  const onRefresh = () => {
    updateCoinPrices.mutateAsync({});
    updateMarketData.mutateAsync({});
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onRefresh}
      disabled={isLoading}
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
};

export default RefreshButton;
