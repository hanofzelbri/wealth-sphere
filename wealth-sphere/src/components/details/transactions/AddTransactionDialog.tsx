import { Transaction } from "@/types/transaction.types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HandleTransactionForm } from "./HandleTransactionForm";
import { useCreateTransaction } from "@/hooks/transactions";

interface AddTransactionDialogProps {
  investmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTransactionDialog = ({
  investmentId,
  open,
  onOpenChange,
}: AddTransactionDialogProps) => {
  const createTransaction = useCreateTransaction(() => onOpenChange(false));

  const handleAddTransaction = async (transaction: Transaction) => {
    createTransaction.mutateAsync({
      ...transaction,
      date: new Date(transaction.date),
      investmentId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Add Transaction</DialogTitle>
        <HandleTransactionForm
          submitButtonText="Add Transaction"
          onSubmit={handleAddTransaction}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
