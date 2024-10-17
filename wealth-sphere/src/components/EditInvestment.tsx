import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInvestmentById, updateInvestment } from '../services/portfolio.service';
import { Investment } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const EditInvestment: React.FC = () => {
    const [investment, setInvestment] = useState<Investment | null>(null);
    const [name, setName] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchInvestment = async () => {
            if (id) {
                const fetchedInvestment = await getInvestmentById(id);
                if (fetchedInvestment) {
                    setInvestment(fetchedInvestment);
                    setName(fetchedInvestment.name);
                    setCurrentPrice(fetchedInvestment.currentPrice.toString());
                }
            }
        };
        fetchInvestment();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (investment && name && currentPrice) {
            const updatedInvestment: Investment = {
                ...investment,
                name,
                currentPrice: parseFloat(currentPrice),
            };
            await updateInvestment(updatedInvestment);
            navigate('/');
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    if (!investment) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Investment</CardTitle>
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
                    <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
