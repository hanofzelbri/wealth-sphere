import React, { useState } from 'react';
import { Investment } from '../types';

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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Investment Name"
        required
      />
      <input
        type="number"
        value={currentPrice}
        onChange={(e) => setCurrentPrice(e.target.value)}
        placeholder="Current Price"
        step="0.01"
        required
      />
      <button type="submit">{investment ? 'Update' : 'Add'} Investment</button>
    </form>
  );
};
