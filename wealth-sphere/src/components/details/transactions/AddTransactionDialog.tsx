import { Transaction } from "@/types/transaction.types";
import { transactionService } from "@/services/transaction.service";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { HandleTransactionForm } from "./HandleTransactionForm";
import { useToast } from "@/hooks/use-toast";

interface AddTransactionDialogProps {
  investmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdd: () => Promise<void>;
}

export const AddTransactionDialog = ({
  investmentId,
  open,
  onOpenChange,
  onTransactionAdd,
}: AddTransactionDialogProps) => {
  const { toast } = useToast();

  const handleAddTransaction = async (transaction: Transaction) => {
    try {
      await transactionService.addTransaction({
        ...transaction,
        date: new Date(transaction.date),
        investmentId,
      });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      onOpenChange(false);
      await onTransactionAdd();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Add Transaction</DialogTitle>
        <HandleTransactionForm
          submitButtonText="Add transaction"
          onSubmit={handleAddTransaction}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
