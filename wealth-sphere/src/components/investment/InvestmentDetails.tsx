import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Investment, Transaction, Staking } from "@/types";
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
import { stakingService } from "@/services/staking.service";
import { StakingList } from "./StakingList";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddStakingForm } from "./AddStakingForm";

export const InvestmentDetails = () => {
    const [investment, setInvestment] = useState<Investment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
    const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const [stakings, setStakings] = useState<Staking[]>([]);
    const [editingStakingId, setEditingStakingId] = useState<string | null>(null);
    const [stakingToDelete, setStakingToDelete] = useState<Staking | null>(null);
    const [isAddStakingDialogOpen, setIsAddStakingDialogOpen] = useState(false);
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

    useEffect(() => {
        const loadStakings = async () => {
            if (!investment?.id) return;
            await stakingService.fetchStakingsByInvestmentId(investment.id);
        };

        loadStakings();
    }, [investment]);

    useEffect(() => {
        const subscription = stakingService.getStakings().subscribe(
            (fetchedStakings) => setStakings(fetchedStakings)
        );

        return () => subscription.unsubscribe();
    }, []);

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

    const handleDeleteStaking = async () => {
        if (!investment || !stakingToDelete || !symbol) return;

        try {
            await stakingService.deleteStaking(investment.id, stakingToDelete.id);
            const updatedInvestment = await investmentService.fetchInvestmentBySymbol(symbol);
            setInvestment(updatedInvestment);
            setStakingToDelete(null);
        } catch (error) {
            console.error("Error deleting staking:", error);
        }
    };

    const handleUpdateStaking = async (staking: Staking) => {
        if (!investment?.id) return;
        await stakingService.updateStaking(investment.id, staking.id, staking);
        setEditingStakingId(null);
    };

    const handleAddStaking = async (data: Omit<Staking, "id">) => {
        if (!investment?.id) return;
        await stakingService.addStaking(investment.id, data);
        setIsAddStakingDialogOpen(false);
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

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Staking Positions</h3>
                        <Dialog open={isAddStakingDialogOpen} onOpenChange={setIsAddStakingDialogOpen}>
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
                </div>

                <DeleteDialog
                    isOpen={!!transactionToDelete}
                    onClose={() => setTransactionToDelete(null)}
                    onConfirm={handleDeleteTransaction}
                    title="Confirm Transaction Deletion"
                    description="Are you sure you want to delete this transaction? This action cannot be undone."
                />

                <DeleteDialog
                    isOpen={!!stakingToDelete}
                    onClose={() => setStakingToDelete(null)}
                    onConfirm={handleDeleteStaking}
                    title="Confirm Staking Deletion"
                    description="Are you sure you want to delete this staking? This action cannot be undone."
                />
            </CardContent>
        </Card>
    );
};
