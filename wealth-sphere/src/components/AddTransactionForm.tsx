import React, { useState } from 'react';
import { Transaction } from '../types';

interface AddTransactionFormProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAddTransaction }) => {
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<'buy' | 'sell'>('buy');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTransaction({
            quantity: parseInt(quantity),
            price: parseFloat(price),
            date,
            type,
        });
        setQuantity('');
        setPrice('');
        setDate('');
        setType('buy');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                required
            />
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                step="0.01"
                required
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <select value={type} onChange={(e) => setType(e.target.value as 'buy' | 'sell')}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
            </select>
            <button type="submit">Add Transaction</button>
        </form>
    );
};
