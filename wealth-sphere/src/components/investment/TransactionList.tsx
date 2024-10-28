import { Transaction } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { EditTransactionForm } from "../EditTransactionForm";
import React from "react";

interface TransactionListProps {
  transactions: Transaction[];
  editingTransactionId: string | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onUpdate: (transaction: Transaction) => void;
  onCancelEdit: () => void;
}

export const TransactionList = ({
  transactions,
  editingTransactionId,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
}: TransactionListProps) => {
  return (
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
          <React.Fragment key={transaction.id}>
            <TableRow>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.quantity}</TableCell>
              <TableCell>${transaction.price.toFixed(2)}</TableCell>
              <TableCell>${(transaction.price * transaction.quantity).toFixed(2)}</TableCell>
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
                    onClick={() => onDelete(transaction)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6}>
                <Collapsible
                  open={editingTransactionId === transaction.id}
                  onOpenChange={(open) => !open && onCancelEdit()}
                >
                  <CollapsibleContent>
                    <EditTransactionForm
                      transaction={transaction}
                      onSubmit={onUpdate}
                      onCancel={onCancelEdit}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
