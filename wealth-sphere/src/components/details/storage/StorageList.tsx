import { useState } from "react";
import { Storage } from "@/types/storage.types";
import { storageService } from "@/services/storage.service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { AddStorageDialog } from "./AddStorageDialog";
import { EditStorageDialog } from "./EditStorageDialog";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface StorageListProps {
  investmentId: string;
  storages: Storage[];
  onStorageChange: () => Promise<void>;
}

export function StorageList({
  investmentId,
  storages,
  onStorageChange,
}: StorageListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await storageService.deleteStorage(deleteId);
      await onStorageChange();
      toast({
        title: "Success",
        description: "Storage deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete storage",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (storage: Storage) => {
    setSelectedStorage(storage);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Storage</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Storage</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(storages) && storages.length > 0 ? (
            storages.map((storage) => (
              <TableRow key={storage.id}>
                <TableCell>{storage.amount}</TableCell>
                <TableCell>{storage.storageLocationId}</TableCell>
                <TableCell>{format(new Date(storage.date), "PP")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(storage)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(storage.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No storage entries found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddStorageDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        investmentId={investmentId}
        onSuccess={onStorageChange}
      />

      {selectedStorage && (
        <EditStorageDialog
          storage={selectedStorage}
          open={!!selectedStorage}
          onOpenChange={(open) => !open && setSelectedStorage(null)}
          onSuccess={onStorageChange}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Storage"
        description="Are you sure you want to delete this storage entry? This action cannot be undone."
      />
    </div>
  );
}
