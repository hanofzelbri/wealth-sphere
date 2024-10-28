import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Investment, Transaction } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { investmentService } from "@/services/investment.service";
import { InvestmentHeader } from "./InvestmentHeader";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { TransactionList } from "./TransactionList";
import { AddTransactionForm } from "../AddTransactionForm";
import { DeleteDialog } from "../DeleteDialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { transactionService } from "@/services/transaction.service";
import { InvestmentSummary } from "./InvestmentSummary";
import { Link } from "react-router-dom";

export const InvestmentDetails = () => {
    const [investment, setInvestment] = useState<Investment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
    const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const { symbol } = useParams<{ symbol: string }>();

    useEffect(() => {
        const loadInvestment = async () => {
            if (!symbol) return;

            setLoading(true);
            setError(null);

            try {
                const fetchedInvestment = await investmentService.fetchInvestmentBySymbol(symbol);
                setInvestment(fetchedInvestment);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch investment data";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadInvestment();
    }, [symbol]);

    const handleSubmitTransaction = async (transaction: Omit<Transaction, 'id'> & { id?: string }) => {
        if (!investment || !symbol) return;

        try {
            if (transaction.id) {
                await transactionService.updateTransaction(investment.id, transaction.id, transaction as Transaction);
            } else {
                await transactionService.addTransaction(investment.id, transaction);
            }

            const updatedInvestment = await investmentService.fetchInvestmentBySymbol(symbol);
            setInvestment(updatedInvestment);
            setEditingTransactionId(null)
            setIsAddTransactionOpen(false);
        } catch (error) {
            console.error("Error submitting transaction:", error);
        }
    };

    const handleDeleteTransaction = async () => {
        if (!investment || !transactionToDelete || !symbol) return;

        try {
            await transactionService.deleteTransaction(investment.id, transactionToDelete.id);
            const updatedInvestment = await investmentService.fetchInvestmentBySymbol(symbol);
            setInvestment(updatedInvestment);
            setTransactionToDelete(null);
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
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

                <TransactionList
                    transactions={investment.transactions}
                    editingTransactionId={editingTransactionId}
                    onEdit={(transaction) => setEditingTransactionId(transaction.id)}
                    onDelete={setTransactionToDelete}
                    onUpdate={handleSubmitTransaction}
                    onCancelEdit={() => setEditingTransactionId(null)}
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
                            onCancel={() => setIsAddTransactionOpen(false)}
                        />
                    </CollapsibleContent>
                </Collapsible>

                <DeleteDialog
                    isOpen={!!transactionToDelete}
                    onClose={() => setTransactionToDelete(null)}
                    onConfirm={handleDeleteTransaction}
                    title="Confirm Transaction Deletion"
                    description="Are you sure you want to delete this transaction? This action cannot be undone."
                />
            </CardContent>
        </Card>
    );
};
