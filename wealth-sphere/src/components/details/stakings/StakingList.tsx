import { useState } from "react";
import { Staking } from "@/types/staking.types";
import { stakingService } from "@/services/staking.service";
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
import { AddStakingDialog } from "./AddStakingDialog";
import { EditStakingDialog } from "./EditStakingDialog";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface StakingListProps {
  investmentId: string;
  stakings: Staking[];
  onStakingChange: () => Promise<void>;
}

export function StakingList({
  investmentId,
  stakings,
  onStakingChange,
}: StakingListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStaking, setSelectedStaking] = useState<Staking | null>(null);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await stakingService.deleteStaking(deleteId);
      await onStakingChange();
      toast({
        title: "Success",
        description: "Staking deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete staking",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (staking: Staking) => {
    setSelectedStaking(staking);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stakings</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Staking</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Cool Down Period</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(stakings) && stakings.length > 0 ? (
            stakings.map((staking) => (
              <TableRow key={staking.id}>
                <TableCell>{staking.amount}</TableCell>
                <TableCell>{staking.location}</TableCell>
                <TableCell>
                  <a
                    href={staking.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {staking.websiteLink}
                  </a>
                </TableCell>
                <TableCell>{staking.coolDownPeriod} days</TableCell>
                <TableCell>
                  {format(new Date(staking.startDate), "PP")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(staking)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(staking.id)}
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
              <TableCell colSpan={6} className="text-center py-4">
                No stakings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddStakingDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        investmentId={investmentId}
        onSuccess={onStakingChange}
      />

      {selectedStaking && (
        <EditStakingDialog
          staking={selectedStaking}
          open={!!selectedStaking}
          onOpenChange={(open) => !open && setSelectedStaking(null)}
          onSuccess={onStakingChange}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staking"
        description="Are you sure you want to delete this staking? This action cannot be undone."
      />
    </div>
  );
}
