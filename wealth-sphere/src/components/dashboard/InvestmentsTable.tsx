import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Eye, Trash2 } from "lucide-react";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { formatNumber } from "@/utils/investmentCalculations";
import { InvestmentEntity } from "@/api-client/types.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  investmentsControllerDeleteInvestmentMutation,
  investmentsControllerGetAllInvestmentsOptions,
} from "@/api-client/@tanstack/react-query.gen";

type SortField =
  | "symbol"
  | "name"
  | "quantity"
  | "currentPrice"
  | "value"
  | "gainLoss"
  | "stakingPercentage";
type SortDirection = "asc" | "desc";

export const InvestmentsTable: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>("value");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [investmentToDelete, setInvestmentToDelete] =
    useState<InvestmentEntity | null>(null);
  const navigate = useNavigate();
  const investments = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });
  const deleteInvestment = useMutation({
    ...investmentsControllerDeleteInvestmentMutation(),
  });

  const calculateValue = (investment: InvestmentEntity) => {
    const totalQuantity = investment.transactions.reduce(
      (sum, t) => sum + (t.type === "buy" ? t.quantity : -t.quantity),
      0
    );
    return totalQuantity * investment.currentPrice;
  };

  const calculateGainLoss = useCallback((investment: InvestmentEntity) => {
    const value = calculateValue(investment);
    const costBasis = investment.transactions.reduce(
      (sum, t) => sum + (t.type === "buy" ? t.quantity * t.price : 0),
      0
    );
    return value - costBasis;
  }, []);

  const calculateTotalQuantity = (investment: InvestmentEntity) => {
    return investment.transactions.reduce(
      (sum, t) => sum + (t.type === "buy" ? t.quantity : -t.quantity),
      0
    );
  };

  const calculateStakingPercentage = useCallback(
    (investment: InvestmentEntity) => {
      if (!investment.stakings) return 0;

      return (
        (investment.stakings.reduce((sum, t) => sum + t.amount, 0) /
          calculateTotalQuantity(investment)) *
        100
      );
    },
    []
  );

  const sortedInvestments = useMemo(() => {
    if (!investments.isSuccess) return [];

    return [...investments.data].sort((a, b) => {
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
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [
    calculateGainLoss,
    calculateStakingPercentage,
    investments.data,
    investments.isSuccess,
    sortDirection,
    sortField,
  ]);

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
      <ArrowUpRight className="inline ml-1 w-6 h-6" />
    ) : (
      <ArrowDownRight className="inline ml-1 w-6 h-6" />
    );
  };

  const handleViewDetails = (symbol: string) => {
    navigate(`/investment/${symbol}`);
  };

  return (
    <>
      {sortedInvestments.length > 0 ? (
        <div>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvestments.map((investment) => {
                const totalQuantity = calculateTotalQuantity(investment);
                const value = calculateValue(investment);
                const gainLoss = calculateGainLoss(investment);
                const stakingPercentage =
                  calculateStakingPercentage(investment);
                return (
                  <React.Fragment key={investment.id}>
                    <TableRow>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar>
                                <AvatarImage src={investment.image} />
                                <AvatarFallback>
                                  {investment.symbol}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{investment.symbol}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{investment.name}</TableCell>
                      <TableCell>{totalQuantity}</TableCell>
                      <TableCell>
                        ${formatNumber(investment.currentPrice)}
                      </TableCell>
                      <TableCell>${formatNumber(value)}</TableCell>
                      <TableCell
                        className={
                          gainLoss >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        ${formatNumber(Math.abs(gainLoss))}
                        {gainLoss >= 0 ? (
                          <ArrowUpRight className="inline ml-1" />
                        ) : (
                          <ArrowDownRight className="inline ml-1" />
                        )}
                      </TableCell>
                      <TableCell>
                        {isNaN(stakingPercentage)
                          ? "-"
                          : `${formatNumber(stakingPercentage)} %`}
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
                            onClick={() => setInvestmentToDelete(investment)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>

          <ConfirmDialog
            open={!!investmentToDelete}
            onOpenChange={(open) => !open && setInvestmentToDelete(null)}
            onConfirm={() =>
              deleteInvestment.mutateAsync({
                path: { id: investmentToDelete?.id || "" },
              })
            }
            title="Delete Investment"
            description="Are you sure you want to delete this investment? This action cannot be undone."
          />
        </div>
      ) : (
        <p>No investments found. Add some investments to see them here.</p>
      )}
    </>
  );
};
