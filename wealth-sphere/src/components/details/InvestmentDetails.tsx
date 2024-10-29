import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Investment } from "@/types/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { investmentService } from "@/services/investment.service";
import { InvestmentHeader } from "./InvestmentHeader";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { TransactionList } from "./transactions/TransactionList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { InvestmentSummary } from "./InvestmentSummary";

export const InvestmentDetails = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { symbol } = useParams<{ symbol: string }>();

  useEffect(() => {
    const loadInvestment = async () => {
      if (!symbol) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedInvestment =
          await investmentService.fetchInvestmentBySymbol(symbol);
        setInvestment(fetchedInvestment);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch investment data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInvestment();
  }, [symbol]);

  if (loading) return <LoadingState />;
  if (error || !investment) return <ErrorState error={error} />;

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <InvestmentHeader investment={investment} />
      </CardHeader>
      <CardContent>
        <Button asChild className="mb-6">
          <Link to="/">Back to Dashboard</Link>
        </Button>

        <InvestmentSummary investment={investment} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Transactions</h3>
          </div>

          <TransactionList
            transactions={investment.transactions}
            investmentId={investment.id}
          />
        </div>
      </CardContent>
    </Card>
  );
};
