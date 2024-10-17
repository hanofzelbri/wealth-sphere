import React from 'react';
import { InvestmentSummary } from './PortfolioDashboard';

interface PortfolioProps {
  investments: InvestmentSummary[];
  renderInvestmentLink: (symbol: string) => React.ReactNode;
}

const Portfolio: React.FC<PortfolioProps> = ({ investments, renderInvestmentLink }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Portfolio</h3>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Symbol</th>
            <th className="text-left">Name</th>
            <th className="text-right">Quantity</th>
            <th className="text-right">Avg. Price</th>
            <th className="text-right">Current Price</th>
            <th className="text-right">Total Value</th>
            <th className="text-right">Profit/Loss</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => (
            <tr key={investment.symbol}>
              <td>{investment.symbol}</td>
              <td>{investment.name}</td>
              <td className="text-right">{investment.totalQuantity}</td>
              <td className="text-right">${investment.averagePurchasePrice.toFixed(2)}</td>
              <td className="text-right">${investment.currentPrice.toFixed(2)}</td>
              <td className="text-right">${(investment.totalQuantity * investment.currentPrice).toFixed(2)}</td>
              <td className="text-right">
                ${((investment.currentPrice - investment.averagePurchasePrice) * investment.totalQuantity).toFixed(2)}
              </td>
              <td className="text-center">
                {renderInvestmentLink(investment.symbol)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
