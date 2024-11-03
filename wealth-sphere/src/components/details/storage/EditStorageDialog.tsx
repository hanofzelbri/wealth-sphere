import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storageService } from "@/services/storage.service";
import { useToast } from "@/hooks/use-toast";
import { Storage } from "@/types/storage.types";
import { storageLocationService } from "@/services/storage-location.service";
import { StorageLocation } from "@/types/storage-location.types";

const storageSchema = z.object({
  amount: z.number().min(0),
  storageLocationId: z.string().min(1),
  date: z.string(),
});

type StorageFormData = z.infer<typeof storageSchema>;

interface EditStorageDialogProps {
  storage: Storage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditStorageDialog({
  storage,
  open,
  onOpenChange,
  onSuccess,
}: EditStorageDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [locations, setLocations] = useState<StorageLocation[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      await storageLocationService.fetchStorageLocations();
    };
    fetchLocations();

    const subscription = storageLocationService
      .getStorageLocations()
      .subscribe((fetchedLocations) => {
        setLocations(fetchedLocations);
      });

    return () => subscription.unsubscribe();
  }, []);

  const form = useForm<StorageFormData>({
    resolver: zodResolver(storageSchema),
    defaultValues: {
      amount: storage.amount,
      storageLocationId: storage.storageLocationId,
      date: new Date(storage.date).toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: StorageFormData) => {
    setIsSubmitting(true);
    try {
      await storageService.updateStorage(storage.id, {
        ...data,
        date: new Date(data.date),
      });
      onSuccess();
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Storage entry updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update storage entry",
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
          <DialogTitle>Edit Storage Entry</DialogTitle>
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storageLocationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              Update Storage Entry
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 
