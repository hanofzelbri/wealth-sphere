import { Staking } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const stakingSchema = z.object({
  amount: z.number().positive(),
  location: z.string().min(1),
  websiteLink: z.string().url(),
  coolDownPeriod: z.number().min(0),
  startDate: z.string(),
});

type StakingFormData = z.infer<typeof stakingSchema>;

interface EditStakingFormProps {
  staking: Staking;
  onSubmit: (staking: Staking) => void;
  onCancel: () => void;
}

export const EditStakingForm = ({
  staking,
  onSubmit,
  onCancel,
}: EditStakingFormProps) => {
  const form = useForm<StakingFormData>({
    resolver: zodResolver(stakingSchema),
    defaultValues: {
      amount: staking.amount,
      location: staking.location,
      websiteLink: staking.websiteLink,
      coolDownPeriod: staking.coolDownPeriod,
      startDate: staking.startDate,
    },
  });

  const handleSubmit = (data: StakingFormData) => {
    onSubmit({
      ...staking,
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 bg-secondary/10 rounded-md"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
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
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};
