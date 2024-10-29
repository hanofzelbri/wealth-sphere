import React, { useState } from "react";
import { Investment } from "../types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { investmentService } from "@/services/investment.service";

interface EditPriceDialogProps {
  investment: Investment;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPriceDialog: React.FC<EditPriceDialogProps> = ({
  investment,
  isOpen,
  onOpenChange,
}) => {
  const [editedPrice, setEditedPrice] = useState(
    investment.currentPrice.toFixed(2)
  );

  const handleSavePrice = async () => {
    if (editedPrice) {
      await investmentService.updateInvestment({
        ...investment,
        currentPrice: parseFloat(editedPrice),
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Current Price</DialogTitle>
          <DialogDescription>
            Update the current price for {investment.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSavePrice}>Save</Button>
      </DialogContent>
    </Dialog>
  );
};
