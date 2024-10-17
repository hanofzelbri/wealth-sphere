import React from 'react';
import { Investment } from '../types';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { updateInvestment } from '../services/portfolio.service';

interface DeleteTransactionDialogProps {
  investment: Investment;
  transactionId: string | null;
  onClose: () => void;
  onUpdateInvestment: (updatedInvestment: Investment) => void;
}

export const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  investment,
  transactionId,
  onClose,
  onUpdateInvestment,
}) => {
  const handleDeleteTransaction = async () => {
    if (transactionId) {
      try {
        const updatedInvestment = {
          ...investment,
          transactions: investment.transactions.filter(t => t.id !== transactionId)
        };
        await updateInvestment(updatedInvestment);
        onUpdateInvestment(updatedInvestment);
        onClose();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <Dialog open={!!transactionId} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteTransaction}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
