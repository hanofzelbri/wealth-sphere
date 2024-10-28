import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Staking } from "@/types";
import { useForm } from "react-hook-form";

const stakingSchema = z.object({
  amount: z.number().positive(),
  location: z.string().min(1),
  websiteLink: z.string().url(),
  coolDownPeriod: z.number().min(0),
  startDate: z.string()
});

interface AddStakingFormProps {
  onSubmit: (data: Omit<Staking, "id">) => void;
}

export const AddStakingForm = ({ onSubmit }: AddStakingFormProps) => {
  const form = useForm<Omit<Staking, "id">>({
    resolver: zodResolver(stakingSchema),
    defaultValues: {
      amount: 0,
      location: "",
      websiteLink: "",
      coolDownPeriod: 0,
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Staking Position</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to Stake</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staking Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="websiteLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website Link</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coolDownPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cool Down Period (days)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                Create Staking Position
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
