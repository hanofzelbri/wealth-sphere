import React, { useState } from 'react';
import { Investment } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddEditInvestmentProps {
  investment?: Investment;
  onSave: (investment: Omit<Investment, 'id' | 'transactions'>) => void;
}

export const AddEditInvestment: React.FC<AddEditInvestmentProps> = ({ investment, onSave }) => {
  const [name, setName] = useState(investment?.name || '');
  const [currentPrice, setCurrentPrice] = useState(investment?.currentPrice.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      currentPrice: parseFloat(currentPrice),
    });
    setName('');
    setCurrentPrice('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{investment ? 'Edit Investment' : 'Add New Investment'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Investment Name"
            required
          />
          <Input
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            placeholder="Current Price"
            step="0.01"
            required
          />
          <Button type="submit">{investment ? 'Update' : 'Add'} Investment</Button>
        </form>
      </CardContent>
    </Card>
  );
};
