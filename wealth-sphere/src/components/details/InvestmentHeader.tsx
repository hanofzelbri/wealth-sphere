import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  useInvestments,
  useUpdateInvestmentLiveData,
} from "@/hooks/investments";
import { formatNumber } from "@/utils/investmentCalculations";

interface InvestmentHeaderProps {
  investmentId: string;
}

export const InvestmentHeader = ({ investmentId }: InvestmentHeaderProps) => {
  const { data: investments } = useInvestments();
  const updateInvestmentLiveData = useUpdateInvestmentLiveData();

  const investment = investments?.find(
    (investment) => investment.id === investmentId
  );

  if (!investment) return;
  const currentPrice = investment.currentPrice ?? 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar>
                <AvatarImage src={investment.image} />
                <AvatarFallback>{investment.symbol}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{investment.symbol}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CardTitle className="text-2xl font-bold ml-2">
          {investment.name}
        </CardTitle>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold">
          ${formatNumber(currentPrice)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => updateInvestmentLiveData.mutateAsync()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
