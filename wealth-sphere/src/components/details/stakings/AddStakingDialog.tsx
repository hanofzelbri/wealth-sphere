import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { stakingService } from "@/services/staking.service";
import { useToast } from "@/hooks/use-toast";

const stakingSchema = z.object({
  amount: z.number().min(0),
  location: z.string().min(1),
  websiteLink: z.string().url(),
  coolDownPeriod: z.number().min(0),
  startDate: z.string(),
});

type StakingFormData = z.infer<typeof stakingSchema>;

interface AddStakingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investmentId: string;
  onSuccess: () => void;
}

export function AddStakingDialog({
  open,
  onOpenChange,
  investmentId,
  onSuccess,
}: AddStakingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<StakingFormData>({
    resolver: zodResolver(stakingSchema),
    defaultValues: {
      amount: 0,
      location: "",
      websiteLink: "",
      coolDownPeriod: 0,
      startDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: StakingFormData) => {
    setIsSubmitting(true);
    try {
      await stakingService.addStaking({
        ...data,
        startDate: new Date(data.startDate),
        investmentId,
      });
      onSuccess();
      onOpenChange(false);
      form.reset();
      toast({
        title: "Success",
        description: "Staking added successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add staking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add New Staking</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
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
                    <Input {...field} />
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

            <Button type="submit" disabled={isSubmitting}>
              Add Staking
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
