import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getInvestments } from '@/services/portfolio.service';
import { Investment } from '@/types';

interface PortfolioProps {
    renderInvestmentLink: (symbol: string) => React.ReactNode;
}

const Portfolio: React.FC<PortfolioProps> = ({ renderInvestmentLink }) => {
    const [investments, setInvestments] = useState<Investment[]>([]);

    useEffect(() => {
        const fetchInvestments = async () => {
            const fetchedInvestments = await getInvestments();
            setInvestments(fetchedInvestments);
        };
        fetchInvestments();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Avg. Price</TableHead>
                            <TableHead className="text-right">Current Price</TableHead>
                            <TableHead className="text-right">Total Value</TableHead>
                            <TableHead className="text-right">Profit/Loss</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {investments.map((investment) => (
                            <TableRow key={investment.id}>
                                <TableCell>{investment.name}</TableCell>
                                <TableCell>{investment.name}</TableCell>
                                <TableCell className="text-right">{investment.transactions.reduce((total, t) => total + (t.type === 'buy' ? t.quantity : -t.quantity), 0)}</TableCell>
                                <TableCell className="text-right">${(investment.transactions.reduce((total, t) => total + t.price * t.quantity, 0) / investment.transactions.reduce((total, t) => total + t.quantity, 0)).toFixed(2)}</TableCell>
                                <TableCell className="text-right">${investment.currentPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right">${(investment.transactions.reduce((total, t) => total + (t.type === 'buy' ? t.quantity : -t.quantity), 0) * investment.currentPrice).toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    ${((investment.currentPrice - (investment.transactions.reduce((total, t) => total + t.price * t.quantity, 0) / investment.transactions.reduce((total, t) => total + t.quantity, 0))) * investment.transactions.reduce((total, t) => total + (t.type === 'buy' ? t.quantity : -t.quantity), 0)).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {renderInvestmentLink(investment.name)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default Portfolio;
