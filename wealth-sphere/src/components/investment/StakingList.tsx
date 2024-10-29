import { Staking } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { EditStakingForm } from "./EditStakingForm";
import React from "react";

interface StakingListProps {
  stakings: Staking[];
  editingStakingId: string | null;
  onEdit: (staking: Staking) => void;
  onDelete: (staking: Staking) => void;
  onUpdate: (staking: Staking) => void;
  onCancelEdit: () => void;
}

export const StakingList = ({
  stakings,
  editingStakingId,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
}: StakingListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Cool Down Period</TableHead>
          <TableHead>Website</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stakings.map((staking) => (
          <React.Fragment key={staking.id}>
            <TableRow>
              <TableCell>
                {new Date(staking.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>${staking.amount.toFixed(2)}</TableCell>
              <TableCell>{staking.location}</TableCell>
              <TableCell>{staking.coolDownPeriod} days</TableCell>
              <TableCell>
                <a
                  href={staking.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </a>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(staking)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(staking)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6}>
                <Collapsible
                  open={editingStakingId === staking.id}
                  onOpenChange={(open) => !open && onCancelEdit()}
                >
                  <CollapsibleContent>
                    <EditStakingForm
                      staking={staking}
                      onSubmit={onUpdate}
                      onCancel={onCancelEdit}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
