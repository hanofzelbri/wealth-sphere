import React from 'react';
import { Investment } from '../types';

interface InvestmentDetailsProps {
  investment: Investment;
}

export const InvestmentDetails: React.FC<InvestmentDetailsProps> = ({ investment }) => {
  return (
    <div>
      <h2>{investment.name}</h2>
      <p>Current Price: ${investment.currentPrice.toFixed(2)}</p>
      <h3>Transactions</h3>
      <ul>
        {investment.transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.type}: {transaction.quantity} shares at ${transaction.price.toFixed(2)} on {transaction.date}
          </li>
        ))}
      </ul>
    </div>
  );
};
