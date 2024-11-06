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
import { useStorageLocations } from "@/hooks/storage-locations";
import { LoadingState } from "@/components/utils/LoadingState";
import { useCreateStorage } from "@/hooks/storages"; // Corrected import

const storageSchema = z.object({
  amount: z.number().min(0),
  storageLocationId: z.string().min(1),
  date: z.string(),
});

type StorageFormData = z.infer<typeof storageSchema>;

interface AddStorageDialogProps {
  investmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStorageDialog({
  open,
  onOpenChange,
  investmentId,
}: AddStorageDialogProps) {
  const {
    data: storageLocations,
    error: storageLocationsError,
    isLoading: storageLocationsLoading,
  } = useStorageLocations();

  const form = useForm<StorageFormData>({
    resolver: zodResolver(storageSchema),
    defaultValues: {
      amount: 0,
      storageLocationId: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const createStorage = useCreateStorage(() => onOpenChange(false));

  if (storageLocationsLoading) return <LoadingState />;
  if (storageLocationsError)
    return <p>Error: {storageLocationsError.message}</p>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add New Storage Entry</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data: StorageFormData) =>
              createStorage.mutateAsync({
                ...data,
                date: new Date(data.date),
                investmentId,
              })
            )}
            className="space-y-4"
          >
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
                      {storageLocations &&
                        storageLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            <div className="flex items-center gap-2">
                              <img
                                src={location.image}
                                alt={location.name}
                                className="w-4 h-4 rounded-full"
                              />
                              <span>{location.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({location.storageLocationType})
                              </span>
                            </div>
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

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Storage</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
