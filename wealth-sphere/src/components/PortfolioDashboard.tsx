import React, { useState, useEffect } from "react";
import { Investment } from "../types/investment.types";
import { investmentService } from "../services/investment.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PortfolioSummary } from "./PortfolioSummary";
import { InvestmentsTable } from "./InvestmentsTable";
import { DeleteDialog } from "./DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RefreshCw, Plus } from "lucide-react";

export const PortfolioDashboard: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investmentToDelete, setInvestmentToDelete] =
    useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewInvestmentDialog, setShowNewInvestmentDialog] = useState(false);
  const [newInvestmentId, setNewInvestmentId] = useState("");

  useEffect(() => {
    fetchInvestments();

    const subscription = investmentService
      .getInvestments()
      .subscribe((fetchedInvestments) => {
        setInvestments(fetchedInvestments || []);
        setIsLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      await investmentService.fetchInvestments();
    } catch (error) {
      console.error("Error fetching investments:", error);
      setIsLoading(false);
    }
  };

  const handleDeleteInvestment = (investment: Investment) => {
    setInvestmentToDelete(investment);
  };

  const confirmDeleteInvestment = async () => {
    if (investmentToDelete) {
      try {
        await investmentService.deleteInvestment(investmentToDelete.id);
        setInvestmentToDelete(null);
        await fetchInvestments();
      } catch (error) {
        console.error("Error deleting investment:", error);
      }
    }
  };

  const handleUpdateInvestment = async (updatedInvestment: Investment) => {
    try {
      await investmentService.updateInvestment(updatedInvestment);
      await fetchInvestments();
    } catch (error) {
      console.error("Error updating investment:", error);
    }
  };

  const handleAddInvestment = async () => {
    try {
      await investmentService.addInvestment(newInvestmentId);
      setShowNewInvestmentDialog(false);
      setNewInvestmentId("");
      await fetchInvestments();
    } catch (error) {
      console.error("Error adding investment:", error);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portfolio Summary</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewInvestmentDialog(true)}>
              <Plus className="h-4 w-4" />
              <span>Add Investment</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchInvestments}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PortfolioSummary investments={investments} />

          {isLoading ? (
            <div>Loading investments...</div>
          ) : (
            <InvestmentsTable
              investments={investments}
              onDeleteInvestment={handleDeleteInvestment}
              onUpdateInvestment={handleUpdateInvestment}
            />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={showNewInvestmentDialog}
        onOpenChange={setShowNewInvestmentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Investment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter investment ID"
              value={newInvestmentId}
              onChange={(e) => setNewInvestmentId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewInvestmentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddInvestment}
              disabled={!newInvestmentId.trim()}
            >
              Add Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        isOpen={!!investmentToDelete}
        onClose={() => setInvestmentToDelete(null)}
        onConfirm={confirmDeleteInvestment}
        title="Confirm Investment Deletion"
        description="Are you sure you want to delete this investment? This action cannot be undone and will remove all associated transactions, storage, and staking information."
      />
    </div>
  );
};
