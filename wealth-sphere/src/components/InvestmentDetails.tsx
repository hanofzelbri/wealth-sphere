import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Investment, Transaction } from '../types';
import { getCurrentInvestment, addTransaction, updateInvestment, fetchInvestmentBySymbol } from '../services/portfolio.service';
import { AddTransactionForm } from './AddTransactionForm';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InvestmentSummary } from './InvestmentSummary';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditPriceDialog } from './EditPriceDialog';
import { DeleteTransactionDialog } from './DeleteTransactionDialog';
import { EditTransactionForm } from './EditTransactionForm';

export const InvestmentDetails: React.FC = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const { symbol } = useParams<{ symbol: string }>();

  useEffect(() => {
    if (symbol) {
      fetchInvestmentBySymbol(symbol);
    }

    const subscription = getCurrentInvestment().subscribe(
      (currentInvestment) => {
        setInvestment(currentInvestment);
      }
    );

    return () => subscription.unsubscribe();
  }, [symbol]);

  const handleSubmitTransaction = async (transaction: Omit<Transaction, 'id'> & { id?: string }) => {
    if (investment && symbol) {
      try {
        if (transaction.id) {
          const updatedTransactions = investment.transactions.map(t =>
            t.id === transaction.id ? transaction as Transaction : t
          );
          await updateInvestment({
            ...investment,
            transactions: updatedTransactions
          });
        } else {
          await addTransaction(symbol, transaction);
        }
        setIsAddTransactionOpen(false);
        setEditingTransaction(null);
      } catch (error) {
        console.error("Error submitting transaction:", error);
      }
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id);
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    if (investment) {
      const updatedTransactions = investment.transactions.map(t =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      await updateInvestment({
        ...investment,
        transactions: updatedTransactions
      });
      setEditingTransactionId(null);
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const onConfirmDelete = async () => {
    if (investment && transactionToDelete) {
      const updatedTransactions = investment.transactions.filter(t => t.id !== transactionToDelete.id);
      await updateInvestment({
        ...investment,
        transactions: updatedTransactions
      });
      setTransactionToDelete(null);
    }
  };

  if (!investment) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-3/4" /></CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{investment.name}</CardTitle>
          <div className="flex items-center">
            <span className="text-xl font-semibold mr-2">
              ${investment.currentPrice.toFixed(2)}
            </span>
            <EditPriceDialog
              investment={investment}
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild className="mb-6">
          <Link to="/">Back to Dashboard</Link>
        </Button>

        <InvestmentSummary investment={investment} />

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
            {investment.transactions.map((transaction) => (
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
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTransaction(transaction)}
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
                      onOpenChange={(open) => !open && setEditingTransactionId(null)}
                    >
                      <CollapsibleContent>
                        <EditTransactionForm
                          transaction={transaction}
                          onSubmit={handleUpdateTransaction}
                          onCancel={() => setEditingTransactionId(null)}
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        <Collapsible
          open={isAddTransactionOpen}
          onOpenChange={setIsAddTransactionOpen}
          className="mt-6"
        >
          <CollapsibleTrigger asChild>
            <Button className="w-full">
              {isAddTransactionOpen ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Close
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <AddTransactionForm
              onSubmit={handleSubmitTransaction}
              onCancel={() => {
                setIsAddTransactionOpen(false);
                setEditingTransaction(null);
              }}
              editingTransaction={editingTransaction}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <DeleteTransactionDialog
        investment={investment}
        transactionId={transactionToDelete?.id || null}
        onClose={() => setTransactionToDelete(null)}
        onUpdateInvestment={onConfirmDelete}
      />
    </Card>
  );
};
