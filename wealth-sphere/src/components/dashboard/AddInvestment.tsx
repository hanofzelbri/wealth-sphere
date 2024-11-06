import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateInvestment } from "@/hooks/investments";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "../ui/input";

export const AddInvestment = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [coinId, setCoinId] = useState("");
  const createInvestment = useCreateInvestment(() => setShowDialog(false));

  return (
    <div>
      <Button onClick={() => setShowDialog(true)}>
        <Plus className="h-4 w-4" />
        <span>Add Investment</span>
      </Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Add Investment</DialogTitle>
          <DialogDescription>Enter coingecko coin id</DialogDescription>
          <div className="py-4">
            <Input
              placeholder="Enter investment ID"
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createInvestment.mutateAsync({ coinId })}
              disabled={!coinId.trim()}
            >
              Add Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
