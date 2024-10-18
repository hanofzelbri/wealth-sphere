import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Investment } from '../types';

const formSchema = z.object({
    symbol: z.string().min(1, { message: "Symbol is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    currentPrice: z.number().positive({ message: "Price must be positive" }),
});

type AddInvestmentFormProps = {
    onAddInvestment: (investment: Investment) => Promise<boolean>;
};

export const AddInvestmentForm: React.FC<AddInvestmentFormProps> = ({ onAddInvestment }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            symbol: "",
            name: "",
            currentPrice: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const newInvestment: Investment = {
            ...values,
            id: Date.now().toString(),
            transactions: [],
        };

        try {
            const success = await onAddInvestment(newInvestment);
            if (success) {
                form.reset();
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Symbol</FormLabel>
                            <FormControl>
                                <Input placeholder="AAPL" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Apple Inc." {...field} />
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
                                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Add Investment</Button>
            </form>
        </Form>
    );
}
