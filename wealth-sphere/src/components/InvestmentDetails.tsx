import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Investment, Transaction } from '../types';
import { getCurrentInvestment, fetchInvestmentById, addTransaction, updateInvestment } from '../services/portfolio.service';
import { AddTransactionForm } from './AddTransactionForm';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateAverageBuyingPrice, calculateProfitLoss, calculateTotalHolding } from '@/utils/investmentCalculations';
import { Input } from "@/components/ui/input";
import { Pencil, Plus, X, Trash2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const InvestmentDetails: React.FC = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
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

  const handleDeleteTransaction = async () => {
    if (investment && id && deletingTransactionId) {
      try {
        const updatedTransactions = investment.transactions.filter(t => t.id !== deletingTransactionId);
        await updateInvestment({
          ...investment,
          transactions: updatedTransactions
        });
        setDeletingTransactionId(null);
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEditPrice = () => {
    setEditedPrice(investment?.currentPrice.toFixed(2) || '');
    setIsDialogOpen(true);
  };

  const handleSavePrice = async () => {
    if (investment && editedPrice) {
      await updateInvestment({
        ...investment,
        currentPrice: parseFloat(editedPrice)
      });
      setIsDialogOpen(false);
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
  const totalHolding = calculateTotalHolding(investment.transactions);
  const currentValue = totalHolding * investment.currentPrice;

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{investment.name}</CardTitle>
          <div className="flex items-center">
            <CardDescription className="text-xl font-semibold mr-2">
              Current Price:
            </CardDescription>
            <span className="text-xl font-semibold mr-2">
              ${investment.currentPrice.toFixed(2)}
            </span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleEditPrice}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Current Price</DialogTitle>
                  <DialogDescription>
                    Update the current price for {investment.name}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={editedPrice}
                      onChange={(e) => setEditedPrice(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleSavePrice}>Save</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Total Holding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold">{totalHolding.toFixed(2)} units</p>
              <p className="text-2xl font-semibold">Current Value: ${currentValue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold mt-8 mb-4">Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investment.transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>${transaction.price.toFixed(2)}</TableCell>
                <TableCell>${(transaction.quantity * transaction.price).toFixed(2)}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingTransactionId(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this transaction? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingTransactionId(null)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteTransaction}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
