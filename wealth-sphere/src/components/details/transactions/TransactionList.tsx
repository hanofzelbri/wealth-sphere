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
import { AddTransactionDialog } from "./AddTransactionDialog";
import { EditTransactionDialog } from "./EditTransactionDialog";
import { compareDesc, format } from "date-fns";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatNumber } from "@/utils/investmentCalculations";
import {
  investmentsControllerGetAllInvestmentsOptions,
  transactionsControllerDeleteTransactionMutation,
} from "@/api-client/@tanstack/react-query.gen";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TransactionEntity } from "@/api-client/types.gen";

interface TransactionListProps {
  investmentId: string;
}

export function TransactionList({ investmentId }: TransactionListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionEntity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const investments = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });
  const deleteTransaction = useMutation({
    ...transactionsControllerDeleteTransactionMutation(),
  });

  if (investments.isLoading) return <p>Loading investments...</p>;
  if (investments.isError) return <p>Error: {investments.error.message}</p>;

  const investment = investments.data?.find((inv) => inv.id === investmentId);
  if (!investment) return <p>Investment not found</p>;

  // Sort transactions by date in descending order
  const sortedTransactions = investment.transactions.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
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
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.date), "PP")}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>${formatNumber(transaction.price)}</TableCell>
                <TableCell>
                  ${formatNumber(transaction.price * transaction.quantity)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedTransaction(transaction)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(transaction.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
      />

      {selectedTransaction && (
        <EditTransactionDialog
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onOpenChange={(open) => !open && setSelectedTransaction(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() =>
          deleteTransaction.mutateAsync({ path: { id: deleteId || "" } })
        }
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
}
