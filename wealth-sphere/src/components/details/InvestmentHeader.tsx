import { Investment } from "@/types/types";
import { CardTitle } from "@/components/ui/card";

interface InvestmentHeaderProps {
  investment: Investment;
}

export const InvestmentHeader = ({ investment }: InvestmentHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-2xl font-bold">{investment.name}</CardTitle>
      <div className="flex items-center">
        <span className="text-xl font-semibold mr-2">
          ${investment.currentPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
