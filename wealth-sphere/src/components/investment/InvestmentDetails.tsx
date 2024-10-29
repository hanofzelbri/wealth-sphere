import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Investment } from "@/types/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { investmentService } from "@/services/investment.service";
import { InvestmentHeader } from "./InvestmentHeader";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { TransactionList } from "./TransactionList";
import { HandleTransactionForm } from "./HandleTransactionForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { transactionService } from "@/services/transaction.service";
import { InvestmentSummary } from "./InvestmentSummary";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Transaction } from "@/types/transaction.types";

export const InvestmentDetails = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] =
    useState(false);
  const [isEditTransactionDialogOpen, setIsEditTransactionDialogOpen] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const { symbol } = useParams<{ symbol: string }>();

  useEffect(() => {
    const loadInvestment = async () => {
      if (!symbol) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedInvestment =
          await investmentService.fetchInvestmentBySymbol(symbol);
        setInvestment(fetchedInvestment);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch investment data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInvestment();
  }, [symbol]);

  const handleAddTransaction = async (transaction: Transaction) => {
    console.log(transaction);
    await transactionService.addTransaction({
      ...transaction,
      date: new Date(transaction.date),
      investmentId: investment?.id || "",
    });

    setIsAddTransactionDialogOpen(false);
  };

  const handleEditTransactionSubmit = async (transaction: Transaction) => {
    await transactionService.updateTransaction(transaction.id, {
      ...transaction,
    });

    setIsEditTransactionDialogOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditTransactionDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setSelectedTransaction(null);
    setIsEditTransactionDialogOpen(false);
  };

  if (loading) return <LoadingState />;
  if (error || !investment) return <ErrorState error={error} />;

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <InvestmentHeader
          investment={investment}
          isDialogOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </CardHeader>
      <CardContent>
        <Button asChild className="mb-6">
          <Link to="/">Back to Dashboard</Link>
        </Button>

        <InvestmentSummary investment={investment} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Transactions</h3>
            <Dialog
              open={isAddTransactionDialogOpen}
              onOpenChange={setIsAddTransactionDialogOpen}
            >
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
                  onCancel={() => setIsAddTransactionDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <TransactionList
            transactions={investment.transactions}
            onEdit={handleEditTransaction}
          />

          <Dialog
            open={isEditTransactionDialogOpen}
            onOpenChange={setIsEditTransactionDialogOpen}
          >
            <DialogContent aria-describedby={undefined}>
              <DialogTitle>Edit Transaction</DialogTitle>
              {selectedTransaction && (
                <HandleTransactionForm
                  submitButtonText="Edit Transaction"
                  transaction={selectedTransaction}
                  onSubmit={handleEditTransactionSubmit}
                  onCancel={handleCancelEdit}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
        {/* 
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Staking Positions</h3>
            <Dialog
              open={isAddStakingDialogOpen}
              onOpenChange={setIsAddStakingDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Staking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <AddStakingForm onSubmit={handleAddStaking} />
              </DialogContent>
            </Dialog>
          </div>

          <StakingList
            stakings={stakings}
            editingStakingId={editingStakingId}
            onEdit={(staking) => setEditingStakingId(staking.id)}
            onDelete={handleDeleteStaking}
            onUpdate={handleUpdateStaking}
            onCancelEdit={() => setEditingStakingId(null)}
          />
        </div> */}
      </CardContent>
    </Card>
  );
};
