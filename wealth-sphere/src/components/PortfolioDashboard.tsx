import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Investment } from '../types';
import { getInvestments, addInvestment, deleteInvestment } from '../services/portfolio.service';
import { AddEditInvestment } from './AddEditInvestment';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PortfolioDashboard: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        const fetchedInvestments = await getInvestments();
        setInvestments(fetchedInvestments);
    };

    const handleAddInvestment = async (newInvestment: Omit<Investment, 'id' | 'transactions'>) => {
        const added = await addInvestment(newInvestment);
        setInvestments([...investments, added]);
    };

    const handleDeleteInvestment = async (id: string) => {
        await deleteInvestment(id);
        setInvestments(investments.filter(inv => inv.id !== id));
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Current Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {investments.map(investment => (
                                <TableRow key={investment.id}>
                                    <TableCell>
                                        <Link to={`/investment/${investment.id}`} className="text-blue-600 hover:underline">
                                            {investment.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>${investment.currentPrice.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button variant="destructive" onClick={() => handleDeleteInvestment(investment.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddEditInvestment onSave={handleAddInvestment} />
        </div>
    );
};
