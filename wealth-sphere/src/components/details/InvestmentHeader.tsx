import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { investmentsControllerGetAllInvestmentsOptions } from "@/api-client/@tanstack/react-query.gen";
import { formatNumber } from "@/utils/investmentCalculations";
import RefreshButton from "../utils/RefreshButton";

interface InvestmentHeaderProps {
  investmentId: string;
}

export const InvestmentHeader = ({ investmentId }: InvestmentHeaderProps) => {
  const { data: investments } = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });

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
        <CardTitle className="text-xl font-bold ml-2">
          {investment.name}
        </CardTitle>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold">
          ${formatNumber(currentPrice)}
        </span>
        <RefreshButton />
      </div>
    </div>
  );
};
