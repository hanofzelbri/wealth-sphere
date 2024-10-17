import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Investment } from '../types';
import { portfolioService } from '../services/portfolio.service';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon, EyeIcon } from 'lucide-react';

export const PortfolioDashboard: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [totalValue, setTotalValue] = useState(0);
    const [totalGainLoss, setTotalGainLoss] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const subscription = portfolioService.getInvestments().subscribe(
            (fetchedInvestments) => {
                setInvestments(fetchedInvestments);
                calculateTotals(fetchedInvestments);
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

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                            <p className="text-sm font-medium">Total Portfolio Value</p>
                            <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">Total Gain/Loss</p>
                            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${Math.abs(totalGainLoss).toFixed(2)}
                                {totalGainLoss >= 0 ? <ArrowUpIcon className="inline ml-1" /> : <ArrowDownIcon className="inline ml-1" />}
                            </p>
                        </div>
                    </div>
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
                                        <TableRow key={investment.id}>
                                            <TableCell>{investment.name}</TableCell>
                                            <TableCell>{totalQuantity}</TableCell>
                                            <TableCell>${investment.currentPrice.toFixed(2)}</TableCell>
                                            <TableCell>${value.toFixed(2)}</TableCell>
                                            <TableCell className={gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                ${Math.abs(gainLoss).toFixed(2)}
                                                {gainLoss >= 0 ? <ArrowUpIcon className="inline ml-1" /> : <ArrowDownIcon className="inline ml-1" />}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(investment.id)}>
                                                    <EyeIcon className="w-4 h-4 mr-2" /> View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <p>No investments found. Add some investments to see them here.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
