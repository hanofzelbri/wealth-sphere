import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Investment, Transaction } from '../types';
import { getInvestmentById, updateInvestment, addTransaction } from '../services/portfolio.service';
import { AddEditInvestment } from './AddEditInvestment';
import { AddTransactionForm } from './AddTransactionForm';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateAverageBuyingPrice, calculateProfitLoss } from '@/utils/investmentCalculations';

export const InvestmentDetails: React.FC = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchInvestment(id);
    }
  }, [id]);

  const fetchInvestment = async (investmentId: string) => {
    const fetchedInvestment = await getInvestmentById(investmentId);
    setInvestment(fetchedInvestment);
  };

  const handleUpdateInvestment = async (updatedInvestment: Omit<Investment, 'id' | 'transactions'>) => {
    if (investment) {
      const updated = await updateInvestment({ ...investment, ...updatedInvestment });
      setInvestment(updated);
    }
  };

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    if (investment) {
      const added = await addTransaction(investment.id, newTransaction);
      setInvestment({ ...investment, transactions: [...investment.transactions, added] });
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

  const averageBuyingPrice = calculateAverageBuyingPrice(investment.transactions);
  const { profitLoss, profitLossPercentage } = calculateProfitLoss(investment.transactions, investment.currentPrice);

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{investment.name}</CardTitle>
        <CardDescription className="text-lg">Current Price: ${investment.currentPrice.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="mb-6">
          <Link to="/">Back to Dashboard</Link>
        </Button>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Buying Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">${averageBuyingPrice.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(profitLoss).toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>
        </div>

        <AddEditInvestment investment={investment} onSave={handleUpdateInvestment} />

        <h3 className="text-xl font-semibold mt-8 mb-4">Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investment.transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>${transaction.price.toFixed(2)}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AddTransactionForm onAddTransaction={handleAddTransaction} />
      </CardContent>
    </Card>
  );
};
