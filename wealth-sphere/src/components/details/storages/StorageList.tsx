import { useState } from "react";
import { Storage } from "@/types/storage.types";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useDeleteStorage } from "@/hooks/storages";
import { useInvestments } from "@/hooks/investments";

interface StorageListProps {
  investmentId: string;
}

export function StorageList({ investmentId }: StorageListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const investments = useInvestments();
  const deleteStorage = useDeleteStorage();

  if (investments.isLoading) return <p>Loading investments...</p>;
  if (investments.isError) return <p>Error: {investments.error.message}</p>;

  const investment = investments.data?.find((inv) => inv.id === investmentId);
  if (!investment) return <p>Investment not found</p>;

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
          {investment.storages.length > 0 ? (
            investment.storages.map((storage) => (
              <TableRow key={storage.id}>
                <TableCell>{storage.amount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={storage.location.image}
                      alt={storage.location.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{storage.location?.name}</span>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(storage.date), "PP")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedStorage(storage)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteId(storage.id);
                      }}
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
                No storages found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddStorageDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        investmentId={investmentId}
      />

      {selectedStorage && (
        <EditStorageDialog
          storage={selectedStorage}
          open={!!selectedStorage}
          onOpenChange={(open) => !open && setSelectedStorage(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteStorage.mutateAsync({ id: deleteId || "" })}
        title="Delete Storage"
        description="Are you sure you want to delete this storage entry? This action cannot be undone."
      />
    </div>
  );
}
