import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Investment } from '../types';
import { portfolioService, getBestPerformer, getWorstPerformer, deleteInvestment, updateInvestment } from '../services/portfolio.service';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon, Eye, Pencil, Trash2, PlusIcon, X } from 'lucide-react';
import { PerformerCard } from './PerformerCard';
import { DeleteTransactionDialog } from './DeleteTransactionDialog';
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { EditInvestmentForm } from './EditInvestmentForm';

export const PortfolioDashboard: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [totalValue, setTotalValue] = useState(0);
    const [totalGainLoss, setTotalGainLoss] = useState(0);
    const [bestPerformer, setBestPerformer] = useState<Investment | null>(null);
    const [worstPerformer, setWorstPerformer] = useState<Investment | null>(null);
    const [investmentToDelete, setInvestmentToDelete] = useState<Investment | null>(null);
    const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const subscription = portfolioService.getInvestments().subscribe(
            (fetchedInvestments) => {
                setInvestments(fetchedInvestments);
                calculateTotals(fetchedInvestments);
                setBestPerformer(getBestPerformer());
                setWorstPerformer(getWorstPerformer());
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const calculateTotals = (investmentList: Investment[]) => {
        let value = 0;
        let gainLoss = 0;
        investmentList.forEach(inv => {
            const totalQuantity = inv.transactions.reduce((sum, t) => sum + (t.type === 'buy' ? t.quantity : -t.quantity), 0);
            const investmentValue = totalQuantity * inv.currentPrice;
            const costBasis = inv.transactions.reduce((sum, t) => sum + (t.type === 'buy' ? t.quantity * t.price : 0), 0);
            value += investmentValue;
            gainLoss += investmentValue - costBasis;
        });
        setTotalValue(value);
        setTotalGainLoss(gainLoss);
    };

    const handleViewDetails = (id: string) => {
        navigate(`/investment/${id}`);
    };

    const handleAddInvestment = () => {
        navigate('/add-investment');
    };

    const handleEditInvestment = (investment: Investment) => {
        setEditingInvestment(investment);
    };

    const handleDeleteInvestment = (investment: Investment) => {
        setInvestmentToDelete(investment);
    };

    const onConfirmDelete = async () => {
        if (investmentToDelete) {
            await deleteInvestment(investmentToDelete.id);
            setInvestmentToDelete(null);
        }
    };

    const handleUpdateInvestment = async (updatedInvestment: Investment) => {
        await updateInvestment(updatedInvestment);
        setEditingInvestment(null);
    };

    const calculatePerformance = (investment: Investment): number => {
        const totalQuantity = investment.transactions.reduce((sum, t) => sum + (t.type === 'buy' ? t.quantity : -t.quantity), 0);
        const currentValue = totalQuantity * investment.currentPrice;
        const costBasis = investment.transactions.reduce((sum, t) => sum + (t.type === 'buy' ? t.quantity * t.price : 0), 0);
        return (currentValue - costBasis) / costBasis * 100;
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">All-time profit</h3>
                                <div className={`text-2xl font-semibold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${Math.abs(totalGainLoss).toFixed(2)}
                                </div>
                                <div className={`flex items-center text-sm ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {totalGainLoss >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                                    {((totalGainLoss / (totalValue - totalGainLoss)) * 100).toFixed(2)}%
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Portfolio Value</h3>
                                <div className="text-2xl font-semibold">
                                    ${totalValue.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                        {bestPerformer && (
                            <PerformerCard
                                title="Best Performer"
                                symbol={bestPerformer.symbol}
                                name={bestPerformer.name}
                                value={calculatePerformance(bestPerformer) * totalValue / 100}
                                percentage={calculatePerformance(bestPerformer)}
                                isPositive={true}
                            />
                        )}
                        {worstPerformer && (
                            <PerformerCard
                                title="Worst Performer"
                                symbol={worstPerformer.symbol}
                                name={worstPerformer.name}
                                value={calculatePerformance(worstPerformer) * totalValue / 100}
                                percentage={calculatePerformance(worstPerformer)}
                                isPositive={false}
                            />
                        )}
                    </div>
                    <Button onClick={handleAddInvestment} className="mb-4">
                        <PlusIcon className="w-4 h-4 mr-2" /> Add Investment
                    </Button>
                    {investments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Current Price</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Gain/Loss</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {investments.map(investment => {
                                    const totalQuantity = investment.transactions.reduce((sum, t) => sum + (t.type === 'buy' ? t.quantity : -t.quantity), 0);
                                    const value = totalQuantity * investment.currentPrice;
                                    const costBasis = investment.transactions.reduce((sum, t) => sum + (t.type === 'buy' ? t.quantity * t.price : 0), 0);
                                    const gainLoss = value - costBasis;
                                    return (
                                        <React.Fragment key={investment.id}>
                                            <TableRow>
                                                <TableCell>{investment.name}</TableCell>
                                                <TableCell>{totalQuantity}</TableCell>
                                                <TableCell>${investment.currentPrice.toFixed(2)}</TableCell>
                                                <TableCell>${value.toFixed(2)}</TableCell>
                                                <TableCell className={gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                    ${Math.abs(gainLoss).toFixed(2)}
                                                    {gainLoss >= 0 ? <ArrowUpIcon className="inline ml-1" /> : <ArrowDownIcon className="inline ml-1" />}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleViewDetails(investment.id)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleEditInvestment(investment)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteInvestment(investment)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <Collapsible
                                                        open={editingInvestment?.id === investment.id}
                                                        onOpenChange={(open) => !open && setEditingInvestment(null)}
                                                    >
                                                        <CollapsibleContent>
                                                            <EditInvestmentForm
                                                                investment={investment}
                                                                onSubmit={handleUpdateInvestment}
                                                                onCancel={() => setEditingInvestment(null)}
                                                            />
                                                        </CollapsibleContent>
                                                    </Collapsible>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <p>No investments found. Add some investments to see them here.</p>
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
