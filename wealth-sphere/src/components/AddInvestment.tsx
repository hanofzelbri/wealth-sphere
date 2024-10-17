import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addInvestment } from '../services/portfolio.service';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AddInvestment: React.FC = () => {
    const [name, setName] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && currentPrice) {
            await addInvestment({
                name,
                currentPrice: parseFloat(currentPrice),
                transactions: []
            });
            navigate('/');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Investment</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700">Current Price</label>
                        <Input
                            type="number"
                            id="currentPrice"
                            value={currentPrice}
                            onChange={(e) => setCurrentPrice(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit">Add Investment</Button>
                </form>
            </CardContent>
        </Card>
    );
};
