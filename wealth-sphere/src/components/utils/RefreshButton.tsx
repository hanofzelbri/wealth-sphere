import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useInvestments } from "@/hooks/investments";
import {
  useUpdateInvestmentLiveData,
  useUpdateMarketData,
} from "@/hooks/coingecko";

const RefreshButton: React.FC = () => {
  const investments = useInvestments();
  const updateInvestmentLiveData = useUpdateInvestmentLiveData();
  const updateMarketData = useUpdateMarketData();

  const isLoading = investments.isLoading;
  const onRefresh = () => {
    updateInvestmentLiveData.mutateAsync();
    updateMarketData.mutateAsync();
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
