import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Investment } from "@/types/investment.types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { investmentService } from "@/services/investment.service";
import { InvestmentHeader } from "./InvestmentHeader";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { TransactionList } from "./transactions/TransactionList";
import { InvestmentSummary } from "./InvestmentSummary";
import { StakingList } from "./stakings/StakingList";
import { StorageList } from "./storage/StorageList";

export const InvestmentDetails = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { symbol } = useParams<{ symbol: string }>();

  const refreshInvestment = async () => {
    if (!symbol) {
      setError("No symbol provided");
      return;
    }

    try {
      setLoading(true);
      const fetchedInvestment = await investmentService.fetchInvestmentBySymbol(
        symbol
      );

      if (!fetchedInvestment) {
        setError("Investment not found");
        return;
      }

      // Ensure transactions and stakings are always arrays
      setInvestment({
        ...fetchedInvestment,
        transactions: fetchedInvestment.transactions || [],
        stakings: fetchedInvestment.stakings || [],
        storages: fetchedInvestment.storages || [],
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch investment data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateInvestmentInfo = async () => {
    try {
      setLoading(true);
      await investmentService.updateInvestmentInfo();
      await refreshInvestment();
    } catch (error) {
      console.error("Error updating investments info:", error);
    }
  };

  useEffect(() => {
    refreshInvestment();
  }, [symbol]);

  if (loading) return <LoadingState />;
  if (error || !investment)
    return <ErrorState error={error || "Investment not found"} />;

  return (
    <Card>
      <CardHeader>
        <InvestmentHeader
          investment={investment}
          onRefresh={updateInvestmentInfo}
        />
      </CardHeader>
      <CardContent>
        <InvestmentSummary investment={investment} />
        <div className="mt-8">
          <TransactionList
            transactions={investment.transactions}
            investmentId={investment.id}
            onTransactionChange={refreshInvestment}
          />
        </div>
        <div className="mt-8">
          <StorageList
            storages={investment.storages}
            investmentId={investment.id}
            onStorageChange={refreshInvestment}
          />
        </div>
        <div className="mt-8">
          <StakingList
            stakings={investment.stakings}
            investmentId={investment.id}
            onStakingChange={refreshInvestment}
          />
        </div>
      </CardContent>
    </Card>
  );
};
