import React, { useState, useEffect } from 'react';
import { Investment, Transaction } from '../types';
import { getInvestments, addInvestment, updateInvestment, deleteInvestment, addTransaction } from '../services/portfolio.service';
import { InvestmentDetails } from './InvestmentDetails';
import { AddEditInvestment } from './AddEditInvestment';
import { AddTransactionForm } from './AddTransactionForm';

export const PortfolioDashboard: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        const fetchedInvestments = await getInvestments();
        setInvestments(fetchedInvestments);
    };

    const handleAddInvestment = async (newInvestment: Omit<Investment, 'id'>) => {
        const added = await addInvestment(newInvestment);
        setInvestments([...investments, added]);
    };

    const handleUpdateInvestment = async (updatedInvestment: Investment) => {
        const updated = await updateInvestment(updatedInvestment);
        setInvestments(investments.map(inv => inv.id === updated.id ? updated : inv));
        setSelectedInvestment(null);
    };

    const handleDeleteInvestment = async (id: string) => {
        await deleteInvestment(id);
        setInvestments(investments.filter(inv => inv.id !== id));
        setSelectedInvestment(null);
    };

    const handleAddTransaction = async (investmentId: string, newTransaction: Omit<Transaction, 'id'>) => {
        const added = await addTransaction(investmentId, newTransaction);
        setInvestments(investments.map(inv => 
            inv.id === investmentId 
                ? { ...inv, transactions: [...inv.transactions, added] }
                : inv
        ));
    };

    return (
        <div>
            <h1>Portfolio Dashboard</h1>
            <AddEditInvestment onSave={handleAddInvestment} />
            <ul>
                {investments.map(investment => (
                    <li key={investment.id}>
                        <button onClick={() => setSelectedInvestment(investment)}>
                            {investment.name} - ${investment.currentPrice.toFixed(2)}
                        </button>
                        <button onClick={() => handleDeleteInvestment(investment.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {selectedInvestment && (
                <div>
                    <InvestmentDetails investment={selectedInvestment} />
                    <AddEditInvestment 
                        investment={selectedInvestment} 
                        onSave={(updated) => handleUpdateInvestment({ ...selectedInvestment, ...updated })} 
                    />
                    <AddTransactionForm 
                        onAddTransaction={(transaction) => handleAddTransaction(selectedInvestment.id, transaction)} 
                    />
                </div>
            )}
        </div>
    );
};
