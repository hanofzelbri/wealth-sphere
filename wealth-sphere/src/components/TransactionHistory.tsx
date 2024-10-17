import React from 'react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
    return (
        <div>
            <h3>Transaction History</h3>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.type}: {transaction.quantity} shares at ${transaction.price.toFixed(2)} on {transaction.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};
