import { TransactionEntity } from "@/api-client/types.gen";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HandleTransactionForm } from "./HandleTransactionForm";
import { useMutation } from "@tanstack/react-query";
import { transactionsControllerUpdateTransactionMutation } from "@/api-client/@tanstack/react-query.gen";

interface EditTransactionDialogProps {
  transaction: TransactionEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: EditTransactionDialogProps) {
  const updateTransaction = useMutation({
    ...transactionsControllerUpdateTransactionMutation(),
    onSuccess: () => onOpenChange(false),
  });

  const handleSubmit = async (updatedTransaction: TransactionEntity) => {
    updateTransaction.mutateAsync({
      path: { id: updatedTransaction.id },
      body: {
        ...updatedTransaction,
        date: new Date(updatedTransaction.date),
      },
    });
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
