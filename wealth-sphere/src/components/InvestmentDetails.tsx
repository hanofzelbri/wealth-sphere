import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { fetchInvestmentDetails, addInvestment, sellInvestment } from '../services/portfolio.service';

interface InvestmentTransaction {
    id: string;
    date: string;
    quantity: number;
    price: number;
    type: 'buy' | 'sell';
}

interface InvestmentDetail {
    symbol: string;
    name: string;
    transactions: InvestmentTransaction[];
    currentPrice: number;
}

const InvestmentDetails: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const [investmentDetail, setInvestmentDetail] = useState<InvestmentDetail | null>(null);
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [newTransaction, setNewTransaction] = useState<Partial<InvestmentTransaction>>({
        type: 'buy',
        quantity: 0,
        price: 0,
    });

    useEffect(() => {
        if (symbol) {
            loadInvestmentDetails(symbol);
        }
    }, [symbol]);

    const loadInvestmentDetails = async (symbol: string) => {
        const data = await fetchInvestmentDetails(symbol);
        setInvestmentDetail(data);
    };

    const handleAddTransaction = async () => {
        if (investmentDetail && newTransaction.quantity && newTransaction.price) {
            if (newTransaction.type === 'buy') {
                await addInvestment({
                    symbol: investmentDetail.symbol,
                    name: investmentDetail.name,
                    quantity: newTransaction.quantity,
                    purchasePrice: newTransaction.price,
                });
            } else {
                await sellInvestment({
                    symbol: investmentDetail.symbol,
                    quantity: newTransaction.quantity,
                    sellPrice: newTransaction.price,
                });
            }
            setShowAddTransaction(false);
            loadInvestmentDetails(investmentDetail.symbol);
        }
    };

    if (!investmentDetail) {
        return <div>Loading...</div>;
    }

    const totalQuantity = investmentDetail.transactions.reduce((sum, transaction) => 
        sum + (transaction.type === 'buy' ? transaction.quantity : -transaction.quantity), 0);
    const averagePurchasePrice = investmentDetail.transactions
        .filter(t => t.type === 'buy')
        .reduce((sum, t) => sum + t.price * t.quantity, 0) / 
        investmentDetail.transactions.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.quantity, 0);

    return (
        <div className="investment-details space-y-6">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800">← Back to Dashboard</Link>
            <h2 className="text-3xl font-bold text-gray-800">{investmentDetail.name} ({investmentDetail.symbol})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Current Price</h3>
                    <p className="text-3xl font-bold text-indigo-600">${investmentDetail.currentPrice.toFixed(2)}</p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Quantity</h3>
                    <p className="text-3xl font-bold text-indigo-600">{totalQuantity}</p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Average Purchase Price</h3>
                    <p className="text-3xl font-bold text-indigo-600">${averagePurchasePrice.toFixed(2)}</p>
                </div>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h3>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Date</th>
                            <th className="text-left">Type</th>
                            <th className="text-right">Quantity</th>
                            <th className="text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investmentDetail.transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.date}</td>
                                <td className={transaction.type === 'buy' ? 'text-green-600' : 'text-red-600'}>
                                    {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                                </td>
                                <td className="text-right">{transaction.quantity}</td>
                                <td className="text-right">${transaction.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Button onClick={() => setShowAddTransaction(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                + Add Transaction
            </Button>
            {showAddTransaction && (
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Transaction</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                value={newTransaction.type}
                                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'buy' | 'sell' })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                value={newTransaction.quantity}
                                onChange={(e) => setNewTransaction({ ...newTransaction, quantity: parseFloat(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                value={newTransaction.price}
                                onChange={(e) => setNewTransaction({ ...newTransaction, price: parseFloat(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <Button onClick={handleAddTransaction} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Add Transaction
                        </Button>
                        <Button onClick={() => setShowAddTransaction(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentDetails;
