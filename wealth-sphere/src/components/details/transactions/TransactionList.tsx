import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteDialog } from "../../DeleteDialog";
import { transactionService } from "@/services/transaction.service";
import { Transaction } from "@/types/transaction.types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HandleTransactionForm } from "./HandleTransactionForm";
import { AddTransactionDialog } from "./AddTransactionDialog";

interface TransactionListProps {
  transactions: Transaction[];
  investmentId: string;
}

export const TransactionList = ({
  transactions,
  investmentId,
}: TransactionListProps) => {
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      await transactionService.fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    try {
      await transactionService.updateTransaction(transaction.id, transaction);
      setTransactionToEdit(null);
      await transactionService.fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <AddTransactionDialog investmentId={investmentId} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.quantity}</TableCell>
              <TableCell>${transaction.price.toFixed(2)}</TableCell>
              <TableCell>
                ${(transaction.price * transaction.quantity).toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setTransactionToEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setTransactionToDelete(transaction)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!transactionToEdit}
        onOpenChange={() => setTransactionToEdit(null)}
      >
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Edit Transaction</DialogTitle>
          {transactionToEdit && (
            <HandleTransactionForm
              submitButtonText="Edit Transaction"
              transaction={transactionToEdit}
              onSubmit={handleEditTransaction}
              onCancel={() => setTransactionToEdit(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteTransaction}
        title="Confirm Transaction Deletion"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        transaction={transactionToDelete!}
      />
    </>
  );
};
