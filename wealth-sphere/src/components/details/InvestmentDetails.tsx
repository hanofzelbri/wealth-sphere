import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Investment } from "@/types/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { investmentService } from "@/services/investment.service";
import { InvestmentHeader } from "./InvestmentHeader";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { TransactionList } from "./transactions/TransactionList";
import { InvestmentSummary } from "./InvestmentSummary";

export const InvestmentDetails = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { symbol } = useParams<{ symbol: string }>();

  const refreshInvestment = async () => {
    if (!symbol) return;

    try {
      const fetchedInvestment = await investmentService.fetchInvestmentBySymbol(
        symbol
      );
      setInvestment(fetchedInvestment);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch investment data";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const loadInvestment = async () => {
      if (!symbol) return;

      setLoading(true);
      setError(null);

      try {
        await refreshInvestment();
      } finally {
        setLoading(false);
      }
    };

    loadInvestment();
  }, [symbol]);

  if (loading) return <LoadingState />;
  if (error || !investment) return <ErrorState error={error} />;

  return (
    <Card className="space-y-8">
      <CardHeader>
        <InvestmentHeader
          investment={investment}
          onRefresh={refreshInvestment}
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
      </CardContent>
    </Card>
  );
};
