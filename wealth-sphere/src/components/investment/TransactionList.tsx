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
import { DeleteDialog } from "../DeleteDialog";
import { transactionService } from "@/services/transaction.service";
import { Transaction } from "@/types/transaction.types";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export const TransactionList = ({
  transactions,
  onEdit,
}: TransactionListProps) => {
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <>
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
                    onClick={() => onEdit(transaction)}
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
