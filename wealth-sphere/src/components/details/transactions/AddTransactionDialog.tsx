import { Transaction } from "@/types/transaction.types";
import { transactionService } from "@/services/transaction.service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HandleTransactionForm } from "./HandleTransactionForm";
import { useState } from "react";

interface AddTransactionDialogProps {
  investmentId: string;
  onTransactionAdd: () => Promise<void>;
}

export const AddTransactionDialog = ({
  investmentId,
  onTransactionAdd,
}: AddTransactionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTransaction = async (transaction: Transaction) => {
    try {
      await transactionService.addTransaction({
        ...transaction,
        date: new Date(transaction.date),
        investmentId,
      });
      setIsOpen(false);
      await onTransactionAdd();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Add Transaction</DialogTitle>
        <HandleTransactionForm
          submitButtonText="Add transaction"
          onSubmit={handleAddTransaction}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
