import React, { useState, useEffect } from 'react';
import { Investment } from '../types';
import { portfolioService, deleteInvestment, updateInvestment, addInvestment } from '../services/portfolio.service';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlusIcon, X } from 'lucide-react';
import { DeleteTransactionDialog } from './DeleteTransactionDialog';
import { AddInvestmentForm } from './AddInvestmentForm';
import { PortfolioSummary } from './PortfolioSummary';
import { InvestmentsTable } from './InvestmentsTable';

export const PortfolioDashboard: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [investmentToDelete, setInvestmentToDelete] = useState<Investment | null>(null);
    const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInvestments();

        const subscription = portfolioService.getInvestments().subscribe(
            (fetchedInvestments) => {
                setInvestments(fetchedInvestments);
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchInvestments = async () => {
        try {
            setIsLoading(true);
            await portfolioService.fetchInvestments();
        } catch (error) {
            console.error('Error fetching investments:', error);
            setIsLoading(false);
        }
    };

    const handleAddInvestment = async (newInvestment: Investment) => {
        try {
            await addInvestment(newInvestment);
            setIsAddInvestmentOpen(false);
            await fetchInvestments();
        } catch (error) {
            console.error('Error adding investment:', error);
        }
    };

    const handleDeleteInvestment = (investment: Investment) => {
        setInvestmentToDelete(investment);
    };

    const onConfirmDelete = async () => {
        if (investmentToDelete) {
            try {
                await deleteInvestment(investmentToDelete.id);
                setInvestmentToDelete(null);
                await fetchInvestments();
            } catch (error) {
                console.error('Error deleting investment:', error);
            }
        }
    };

    const handleUpdateInvestment = async (updatedInvestment: Investment) => {
        try {
            await updateInvestment(updatedInvestment);
            await fetchInvestments();
        } catch (error) {
            console.error('Error updating investment:', error);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <PortfolioSummary investments={investments} />
                    <Collapsible
                        open={isAddInvestmentOpen}
                        onOpenChange={setIsAddInvestmentOpen}
                        className="mb-4"
                    >
                        <CollapsibleTrigger asChild>
                            <Button>
                                {isAddInvestmentOpen ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon className="w-4 h-4 mr-2" /> Add Investment
                                    </>
                                )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                            <AddInvestmentForm onAddInvestment={handleAddInvestment} />
                        </CollapsibleContent>
                    </Collapsible>
                    {isLoading ? (
                        <div>Loading investments...</div>
                    ) : (
                        <InvestmentsTable
                            investments={investments}
                            onDeleteInvestment={handleDeleteInvestment}
                            onUpdateInvestment={handleUpdateInvestment}
                        />
                    )}
                </CardContent>
            </Card>
            <DeleteTransactionDialog
                investment={investmentToDelete as Investment}
                transactionId={investmentToDelete?.id || null}
                onClose={() => setInvestmentToDelete(null)}
                onUpdateInvestment={onConfirmDelete}
            />
        </div>
    );
};
