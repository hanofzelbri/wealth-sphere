import { Transaction } from "@/types/transaction.types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HandleTransactionForm } from "./HandleTransactionForm";
import { transactionService } from "@/services/transaction.service";
import { useToast } from "@/hooks/use-toast";

interface EditTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onSuccess,
}: EditTransactionDialogProps) {
  const { toast } = useToast();

  const handleSubmit = async (updatedTransaction: Transaction) => {
    try {
      await transactionService.updateTransaction(transaction.id, updatedTransaction);
      await onSuccess();
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <HandleTransactionForm
          transaction={transaction}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitButtonText="Update Transaction"
        />
      </DialogContent>
    </Dialog>
  );
} 
