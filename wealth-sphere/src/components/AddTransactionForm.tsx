import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddTransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'> & { id?: string }) => Promise<void>;
  onCancel: () => void;
  editingTransaction: Transaction | null;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  onSubmit,
  onCancel,
  editingTransaction
}) => {
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setQuantity(editingTransaction.quantity.toString());
      setPrice(editingTransaction.price.toString());
      setDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
    } else {
      setType('buy');
      setQuantity('');
      setPrice('');
      setDate('');
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Omit<Transaction, 'id'> & { id?: string } = {
      type,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      date: new Date(date).toISOString(),
    };
    if (editingTransaction) {
      transaction.id = editingTransaction.id;
    }
    await onSubmit(transaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={(value: 'buy' | 'sell') => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editingTransaction ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
};
