import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';
import AddInvestment from './AddInvestment';
import Portfolio from './Portfolio';
import PerformanceChart from './PerformanceChart';
import { fetchPortfolioSummary, addInvestment, fetchPerformanceData } from '../services/portfolio.service';

export interface InvestmentSummary {
    symbol: string;
    name: string;
    totalQuantity: number;
    averagePurchasePrice: number;
    currentPrice: number;
}

interface PerformanceData {
    date: string;
    value: number;
}

const PortfolioDashboard: React.FC = () => {
    const [portfolioSummary, setPortfolioSummary] = useState<InvestmentSummary[]>([]);
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const [showAddInvestment, setShowAddInvestment] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPortfolioSummary();
        loadPerformanceData();
    }, []);

    const loadPortfolioSummary = async () => {
        try {
            const data = await fetchPortfolioSummary();
            setPortfolioSummary(data);
        } catch (error) {
            setError('Failed to load portfolio summary');
        }
    };

    const loadPerformanceData = async () => {
        try {
            const data = await fetchPerformanceData();
            setPerformanceData(data);
        } catch (error) {
            setError('Failed to load performance data');
        }
    };

    const handleAddInvestment = async (investment: Omit<InvestmentSummary, 'totalQuantity' | 'averagePurchasePrice'> & { quantity: number, purchasePrice: number }) => {
        try {
            await addInvestment(investment);
            setShowAddInvestment(false);
            loadPortfolioSummary();
            loadPerformanceData();
        } catch (error) {
            setError('Failed to add investment');
        }
    };

    const totalValue = portfolioSummary.reduce((sum, investment) => sum + investment.totalQuantity * investment.currentPrice, 0);
    const totalProfitLoss = portfolioSummary.reduce((sum, investment) => {
        const investmentProfitLoss = (investment.currentPrice - investment.averagePurchasePrice) * investment.totalQuantity;
        return sum + investmentProfitLoss;
    }, 0);

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="portfolio-dashboard space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Crypto Portfolio Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Portfolio Value</h3>
                    <p className="text-3xl font-bold text-indigo-600">${totalValue.toFixed(2)}</p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Profit/Loss</h3>
                    <p className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalProfitLoss >= 0 ? '↑' : '↓'} ${Math.abs(totalProfitLoss).toFixed(2)}
                    </p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Number of Investments</h3>
                    <p className="text-3xl font-bold text-indigo-600">{portfolioSummary.length}</p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Add New Investment</h3>
                    <Button onClick={() => setShowAddInvestment(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        + Add Investment
                    </Button>
                </div>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Portfolio Performance</h3>
                <PerformanceChart data={performanceData} />
            </div>
            <Portfolio
                investments={portfolioSummary}
                renderInvestmentLink={(symbol) => (
                    <Link to={`/investment/${symbol}`} className="text-indigo-600 hover:text-indigo-800">
                        View Details
                    </Link>
                )}
            />
            {showAddInvestment && (
                <AddInvestment onAddInvestment={handleAddInvestment} onCancel={() => setShowAddInvestment(false)} />
            )}
        </div>
    );
};

export default PortfolioDashboard;
