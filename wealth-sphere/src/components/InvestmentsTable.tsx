import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Investment } from "../types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, Eye, Pencil, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { EditInvestmentForm } from "./EditInvestmentForm";

interface InvestmentsTableProps {
  investments: Investment[];
  onDeleteInvestment: (investment: Investment) => void;
  onUpdateInvestment: (updatedInvestment: Investment) => void;
}

type SortField =
  | "symbol"
  | "name"
  | "quantity"
  | "currentPrice"
  | "value"
  | "gainLoss"
  | "stakingPercentage"
  | "storageUsage";
type SortDirection = "asc" | "desc";

export const InvestmentsTable: React.FC<InvestmentsTableProps> = ({
  investments,
  onDeleteInvestment,
  onUpdateInvestment,
}) => {
  const [sortField, setSortField] = useState<SortField>("value");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(
    null
  );
  const navigate = useNavigate();

  const calculateValue = (investment: Investment) => {
    const totalQuantity = investment.transactions.reduce(
      (sum, t) => sum + (t.type === "buy" ? t.quantity : -t.quantity),
      0
    );
    return totalQuantity * investment.currentPrice;
  };

  const calculateGainLoss = (investment: Investment) => {
    const value = calculateValue(investment);
    const costBasis = investment.transactions.reduce(
      (sum, t) => sum + (t.type === "buy" ? t.quantity * t.price : 0),
      0
    );
    return value - costBasis;
  };

  const calculateTotalQuantity = (investment: Investment) => {
    return investment.transactions.reduce(
      (sum, t) => sum + (t.type === "buy" ? t.quantity : -t.quantity),
      0
    );
  };

  const calculateStakingPercentage = (investment: Investment) => {
    if (!investment.stakings) return 0;

    return (
      (investment.stakings.reduce((sum, t) => sum + t.amount, 0) /
        calculateTotalQuantity(investment)) *
      100
    );
  };

  const sortedInvestments = useMemo(() => {
    return [...investments].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "symbol":
        case "name":
          aValue = a[sortField].toLowerCase();
          bValue = b[sortField].toLowerCase();
          break;
        case "currentPrice":
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case "quantity":
          aValue = calculateTotalQuantity(a);
          bValue = calculateTotalQuantity(b);
          break;
        case "value":
          aValue = calculateValue(a);
          bValue = calculateValue(b);
          break;
        case "gainLoss":
          aValue = calculateGainLoss(a);
          bValue = calculateGainLoss(b);
          break;
        case "stakingPercentage":
          aValue = calculateStakingPercentage(a);
          bValue = calculateStakingPercentage(b);
          break;
        case "storageUsage":
          aValue = a.storageUsage || 0;
          bValue = b.storageUsage || 0;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [investments, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? (
      <ArrowUpIcon className="inline ml-1 w-4 h-4" />
    ) : (
      <ArrowDownIcon className="inline ml-1 w-4 h-4" />
    );
  };

  const handleViewDetails = (symbol: string) => {
    navigate(`/investment/${symbol}`);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
  };

  return (
    <>
      {sortedInvestments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("symbol")}
                className="cursor-pointer"
              >
                Symbol {renderSortIcon("symbol")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("name")}
                className="cursor-pointer"
              >
                Name {renderSortIcon("name")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("quantity")}
                className="cursor-pointer"
              >
                Quantity {renderSortIcon("quantity")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("currentPrice")}
                className="cursor-pointer"
              >
                Current Price {renderSortIcon("currentPrice")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("value")}
                className="cursor-pointer"
              >
                Value {renderSortIcon("value")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("gainLoss")}
                className="cursor-pointer"
              >
                Gain/Loss {renderSortIcon("gainLoss")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("stakingPercentage")}
                className="cursor-pointer"
              >
                Staked {renderSortIcon("stakingPercentage")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("storageUsage")}
                className="cursor-pointer"
              >
                Storage Usage {renderSortIcon("storageUsage")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInvestments.map((investment) => {
              const totalQuantity = calculateTotalQuantity(investment);
              const value = calculateValue(investment);
              const gainLoss = calculateGainLoss(investment);
              const stakingPercentage = calculateStakingPercentage(investment);
              return (
                <React.Fragment key={investment.id}>
                  <TableRow>
                    <TableCell>{investment.symbol}</TableCell>
                    <TableCell>{investment.name}</TableCell>
                    <TableCell>{totalQuantity}</TableCell>
                    <TableCell>${investment.currentPrice.toFixed(2)}</TableCell>
                    <TableCell>${value.toFixed(2)}</TableCell>
                    <TableCell
                      className={
                        gainLoss >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      ${Math.abs(gainLoss).toFixed(2)}
                      {gainLoss >= 0 ? (
                        <ArrowUpIcon className="inline ml-1" />
                      ) : (
                        <ArrowDownIcon className="inline ml-1" />
                      )}
                    </TableCell>
                    <TableCell>
                      {stakingPercentage?.toFixed(0) || "0"} %
                    </TableCell>
                    <TableCell>
                      {investment.storageUsage?.toFixed(2) || "0.00"} GB
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleViewDetails(investment.symbol)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditInvestment(investment)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteInvestment(investment)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Collapsible
                        open={editingInvestment?.id === investment.id}
                        onOpenChange={(open) =>
                          !open && setEditingInvestment(null)
                        }
                      >
                        <CollapsibleContent>
                          <EditInvestmentForm
                            investment={investment}
                            onSubmit={onUpdateInvestment}
                            onCancel={() => setEditingInvestment(null)}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p>No investments found. Add some investments to see them here.</p>
      )}
    </>
  );
};
