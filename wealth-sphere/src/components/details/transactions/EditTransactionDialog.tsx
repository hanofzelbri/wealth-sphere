import { Transaction, UpdateTransactionInput } from "@/types/transaction.types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HandleTransactionForm } from "./HandleTransactionForm";
import { useUpdateTransaction } from "@/hooks/transactions";

interface EditTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: EditTransactionDialogProps) {
  const updateTransaction = useUpdateTransaction(() => onOpenChange(false));

  const handleSubmit = async (updatedTransaction: UpdateTransactionInput) => {
    updateTransaction.mutateAsync(updatedTransaction);
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
