import { useState } from "react";
import { Staking } from "@/types/staking.types";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useDeleteStaking } from "@/hooks/stakings";
import { useInvestments } from "@/hooks/investments";

interface StakingListProps {
  investmentId: string;
}

export function StakingList({ investmentId }: StakingListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStaking, setSelectedStaking] = useState<Staking | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const investments = useInvestments();
  const deleteStaking = useDeleteStaking(() => setDeleteId(null));

  if (investments.isLoading) return <p>Loading investments...</p>;
  if (investments.isError) return <p>Error: {investments.error.message}</p>;

  const investment = investments.data?.find((inv) => inv.id === investmentId);
  if (!investment) return <p>Investment not found</p>;

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteStaking.mutateAsync({ id: deleteId });
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
          {investment.stakings.length > 0 ? (
            investment.stakings.map((staking) => (
              <TableRow key={staking.id}>
                <TableCell>{staking.amount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={staking.location.image}
                      alt={staking.location.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{staking.location.name}</span>
                  </div>
                </TableCell>
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
                <TableCell>{format(new Date(staking.startDate), "PP")}</TableCell>
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
                      onClick={() => setDeleteId(staking.id)}
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
      />

      {selectedStaking && (
        <EditStakingDialog
          staking={selectedStaking}
          open={!!selectedStaking}
          onOpenChange={(open) => !open && setSelectedStaking(null)}
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
