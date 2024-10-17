import React, { useState } from 'react';
import { Investment, Transaction } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { DeleteTransactionDialog } from './DeleteTransactionDialog';

interface TransactionTableProps {
  investment: Investment;
  onEditTransaction: (transaction: Transaction) => void;
  onUpdateInvestment: (updatedInvestment: Investment) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  investment,
  onEditTransaction,
  onUpdateInvestment,
}) => {
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

  return (
    <>
      <h3 className="text-xl font-semibold mt-8 mb-4">Transactions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investment.transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.quantity}</TableCell>
              <TableCell>${transaction.price.toFixed(2)}</TableCell>
              <TableCell>${(transaction.quantity * transaction.price).toFixed(2)}</TableCell>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEditTransaction(transaction)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeletingTransactionId(transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteTransactionDialog
        investment={investment}
        transactionId={deletingTransactionId}
        onClose={() => setDeletingTransactionId(null)}
        onUpdateInvestment={onUpdateInvestment}
      />
    </>
  );
};
