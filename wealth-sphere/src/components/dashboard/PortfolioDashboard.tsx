import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PortfolioSummary } from "./PortfolioSummary";
import { InvestmentsTable } from "./InvestmentsTable";
import { LoadingState } from "../utils/LoadingState";
import { AddInvestment } from "./AddInvestment";
import RefreshButton from "../utils/RefreshButton";
import { investmentsControllerGetAllInvestmentsOptions } from "@/api-client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

export const PortfolioDashboard: React.FC = () => {
  const {data, isError, error, isLoading } = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions({}),
  });

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portfolio Summary</CardTitle>
          <div className="flex gap-2">
            <AddInvestment />
            <RefreshButton />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              <PortfolioSummary />
              {/* <PortfolioChart /> */}
              <InvestmentsTable />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
