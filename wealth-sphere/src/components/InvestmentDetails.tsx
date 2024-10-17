import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Investment, Transaction } from '../types';
import { getCurrentInvestment, fetchInvestmentById, addTransaction, updateInvestment } from '../services/portfolio.service';
import { AddTransactionForm } from './AddTransactionForm';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InvestmentSummary } from './InvestmentSummary';
import { TransactionTable } from './TransactionTable';
import { EditPriceDialog } from './EditPriceDialog';

export const InvestmentDetails: React.FC = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchInvestmentById(id);
    }

    const subscription = getCurrentInvestment().subscribe(
      (currentInvestment) => {
        setInvestment(currentInvestment);
      }
    );

    return () => subscription.unsubscribe();
  }, [id]);

  const handleSubmitTransaction = async (transaction: Omit<Transaction, 'id'> & { id?: string }) => {
    if (investment && id) {
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
          await addTransaction(id, transaction);
        }
        setIsAddTransactionOpen(false);
        setEditingTransaction(null);
      } catch (error) {
        console.error("Error submitting transaction:", error);
      }
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsAddTransactionOpen(true);
  };

  const handleUpdateInvestment = (updatedInvestment: Investment) => {
    setInvestment(updatedInvestment);
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

        <TransactionTable
          investment={investment}
          onEditTransaction={handleEditTransaction}
          onUpdateInvestment={handleUpdateInvestment}
        />

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
    </Card>
  );
};
