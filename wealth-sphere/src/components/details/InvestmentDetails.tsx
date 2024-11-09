import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { InvestmentHeader } from "./InvestmentHeader";
import { LoadingState } from "../utils/LoadingState";
import { ErrorState } from "../utils/ErrorState";
import { TransactionList } from "./transactions/TransactionList";
import { InvestmentSummary } from "./InvestmentSummary";
import { StakingList } from "./stakings/StakingList";
import { StorageList } from "./storages/StorageList";
import { useQuery } from "@tanstack/react-query";
import { investmentsControllerGetAllInvestmentsOptions } from "@/api-client/@tanstack/react-query.gen";

export const InvestmentDetails = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const investments = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });

  if (investments.isLoading) return <LoadingState />;
  if (investments.isError)
    return <ErrorState error={investments.error.message} />;

  const investment = investments.data?.find(
    (investment) => investment.symbol === symbol
  );

  if (!investment) return <ErrorState error="Investment not found" />;

  return (
    <Card>
      <CardHeader>
        <InvestmentHeader investmentId={investment.id} />
      </CardHeader>
      <CardContent>
        <InvestmentSummary investment={investment} />
        <div className="mt-8">
          <TransactionList investmentId={investment.id} />
        </div>
        <div className="mt-8">
          <StorageList investmentId={investment.id} />
        </div>
        <div className="mt-8">
          <StakingList investmentId={investment.id} />
        </div>
      </CardContent>
    </Card>
  );
};
