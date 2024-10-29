import { Investment } from "@/types/types";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface InvestmentHeaderProps {
  investment: Investment;
  onRefresh: () => Promise<void>;
}

export const InvestmentHeader = ({ investment, onRefresh }: InvestmentHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-2xl font-bold">{investment.name}</CardTitle>
      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold">
          ${investment.currentPrice.toFixed(2)}
        </span>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
