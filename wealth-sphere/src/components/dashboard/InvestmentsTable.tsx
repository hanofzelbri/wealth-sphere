import React, { useState, useMemo } from "react";
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
import { Eye, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { ConfirmDialog } from "../ui/confirm-dialog";
import {
  calculateProfitLoss,
  formatNumber,
} from "@/utils/investmentCalculations";
import { InvestmentEntity } from "@/api-client/types.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  investmentsControllerDeleteInvestmentMutation,
  investmentsControllerGetAllInvestmentsOptions,
  stakingsControllerGetAllStakingPercentagesOptions,
} from "@/api-client/@tanstack/react-query.gen";
import { GainLossDisplay } from "../utils/GainLossDisplay";

type SortField =
  | "symbol"
  | "name"
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
  const stakingPercentages = useQuery({
    ...stakingsControllerGetAllStakingPercentagesOptions(),
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
        case "value":
          aValue = calculateValue(a);
          bValue = calculateValue(b);
          break;
        case "gainLoss":
          aValue = calculateProfitLoss(
            a.transactions,
            a.currentPrice
          ).profitLoss;
          bValue = calculateProfitLoss(
            b.transactions,
            b.currentPrice
          ).profitLoss;
          break;
        case "stakingPercentage":
          aValue =
            stakingPercentages.data?.find((sp) => sp.investmentId === a.id)
              ?.percentageStaked ?? 0;
          bValue =
            stakingPercentages.data?.find((sp) => sp.investmentId === b.id)
              ?.percentageStaked ?? 0;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      aValue = aValue ?? 0;
      bValue = bValue ?? 0;
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [
    investments.data,
    investments.isSuccess,
    sortDirection,
    sortField,
    stakingPercentages.data,
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
      <ArrowUp className="inline ml-1 w-6 h-6" />
    ) : (
      <ArrowDown className="inline ml-1 w-6 h-6" />
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
                <TableHead onClick={() => handleSort("symbol")}>
                  Symbol {renderSortIcon("symbol")}
                </TableHead>
                <TableHead onClick={() => handleSort("name")}>
                  Name {renderSortIcon("name")}
                </TableHead>
                <TableHead onClick={() => handleSort("currentPrice")}>
                  Current Price {renderSortIcon("currentPrice")}
                </TableHead>
                <TableHead onClick={() => handleSort("value")}>
                  Value {renderSortIcon("value")}
                </TableHead>
                <TableHead onClick={() => handleSort("gainLoss")}>
                  Gain/Loss {renderSortIcon("gainLoss")}
                </TableHead>
                <TableHead onClick={() => handleSort("stakingPercentage")}>
                  Staked {renderSortIcon("stakingPercentage")}
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvestments.map((investment) => {
                const value = calculateValue(investment);
                const { profitLoss, profitLossPercentage } =
                  calculateProfitLoss(
                    investment.transactions,
                    investment.currentPrice
                  );
                const stakingPercentage = stakingPercentages.data?.find(
                  (sp) => sp.investmentId === investment.id
                )?.percentageStaked;

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
                      <TableCell>
                        ${formatNumber(Number(investment.currentPrice))}
                      </TableCell>
                      <TableCell>${formatNumber(value)}</TableCell>
                      <TableCell>
                        <GainLossDisplay
                          value={profitLoss}
                          percentage={profitLossPercentage}
                          vertical={true}
                        />
                      </TableCell>
                      <TableCell>
                        {stakingPercentage !== undefined
                          ? `${formatNumber(stakingPercentage)}%`
                          : "-"}
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
