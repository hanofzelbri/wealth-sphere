import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Stock } from './PortfolioDashboard';

interface AddStockProps {
  onAddStock: (stock: Stock) => void;
  onCancel: () => void;
}

const AddStock: React.FC<AddStockProps> = ({ onAddStock, onCancel }) => {
  const [stock, setStock] = useState<Stock>({
    symbol: '',
    name: '',
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStock(prevStock => ({ ...prevStock, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStock(stock);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Stock</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="symbol"
            placeholder="Stock Symbol"
            value={stock.symbol}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Stock Name"
            value={stock.name}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={stock.quantity}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="number"
            name="purchasePrice"
            placeholder="Purchase Price"
            value={stock.purchasePrice}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="number"
            name="currentPrice"
            placeholder="Current Price"
            value={stock.currentPrice}
            onChange={handleChange}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <div className="flex justify-end">
            <Button type="button" onClick={onCancel} className="mr-2">Cancel</Button>
            <Button type="submit">Add Stock</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStock;
