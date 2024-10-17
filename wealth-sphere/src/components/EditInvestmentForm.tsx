import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Investment } from '../types';
import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    symbol: z.string().min(1, 'Symbol is required'),
    currentPrice: z.coerce.number().min(0, 'Price must be a positive number'),
});

type FormData = z.infer<typeof formSchema>;

interface EditInvestmentFormProps {
    investment: Investment;
    onSubmit: (updatedInvestment: Investment) => void;
    onCancel: () => void;
}

export const EditInvestmentForm: React.FC<EditInvestmentFormProps> = ({ investment, onSubmit, onCancel }) => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: investment.name,
            symbol: investment.symbol,
            currentPrice: investment.currentPrice,
        },
    });

    const handleSubmit = (data: FormData) => {
        onSubmit({
            ...investment,
            ...data,
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Symbol</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="currentPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Price</FormLabel>
                            <FormControl>
                                <Input {...field} type="number" step="0.01" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </Form>
    );
};
