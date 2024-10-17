import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Investment } from './PortfolioDashboard';

interface AddInvestmentProps {
  onAddInvestment: (investment: Investment) => void;
  onCancel: () => void;
}

const AddInvestment: React.FC<AddInvestmentProps> = ({ onAddInvestment, onCancel }) => {
  const [investment, setInvestment] = useState<Omit<Investment, 'id'>>({
    symbol: '',
    name: '',
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvestment(prevInvestment => ({ ...prevInvestment, [name]: name === 'symbol' || name === 'name' ? value : parseFloat(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddInvestment(investment as Investment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-md w-full">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add New Investment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">Crypto Symbol</label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={investment.symbol}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Crypto Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={investment.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={investment.quantity}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              step="any"
            />
          </div>
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">Purchase Price</label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              value={investment.purchasePrice}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              step="any"
            />
          </div>
          <div>
            <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700">Current Price</label>
            <input
              type="number"
              id="currentPrice"
              name="currentPrice"
              value={investment.currentPrice}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              step="any"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md">Cancel</Button>
            <Button type="submit" className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md">Add Investment</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvestment;
