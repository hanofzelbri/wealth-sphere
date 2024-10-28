import { Investment } from "@/types";
import { CardTitle } from "@/components/ui/card";
import { EditPriceDialog } from "../EditPriceDialog";

interface InvestmentHeaderProps {
  investment: Investment;
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvestmentHeader = ({
  investment,
  isDialogOpen,
  onOpenChange,
}: InvestmentHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-2xl font-bold">{investment.name}</CardTitle>
      <div className="flex items-center">
        <span className="text-xl font-semibold mr-2">
          ${investment.currentPrice.toFixed(2)}
        </span>
        <EditPriceDialog
          investment={investment}
          isOpen={isDialogOpen}
          onOpenChange={onOpenChange}
        />
      </div>
    </div>
  );
};
