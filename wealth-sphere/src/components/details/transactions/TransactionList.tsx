import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction.types";
import { transactionService } from "@/services/transaction.service";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { EditTransactionDialog } from "./EditTransactionDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface TransactionListProps {
  investmentId: string;
  transactions: Transaction[];
  onTransactionChange: () => Promise<void>;
}

export function TransactionList({
  investmentId,
  transactions,
  onTransactionChange,
}: TransactionListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await transactionService.deleteTransaction(deleteId);
      await onTransactionChange();
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Button
          variant="default"
          className="bg-black text-white hover:bg-black/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Transaction
        </Button>
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
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.date), "PP")}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>${transaction.price.toFixed(2)}</TableCell>
                <TableCell>
                  ${(transaction.price * transaction.quantity).toFixed(2)}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(transaction.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddTransactionDialog
        investmentId={investmentId}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onTransactionAdd={onTransactionChange}
      />

      {selectedTransaction && (
        <EditTransactionDialog
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onOpenChange={(open) => !open && setSelectedTransaction(null)}
          onSuccess={onTransactionChange}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
}
