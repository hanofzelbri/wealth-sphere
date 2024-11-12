import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PortfolioSummary } from "./PortfolioSummary";
import { InvestmentsTable } from "./InvestmentsTable";
import { LoadingState } from "../utils/LoadingState";
import { AddInvestment } from "./AddInvestment";
import RefreshButton from "../utils/RefreshButton";
import { investmentsControllerGetAllInvestmentsOptions } from "@/api-client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { PortfolioChart } from "./PortfolioChart";
import AllocationChart from "./AllocationChart";
import { AltcoinSeasonIndex } from "./AltcoinSeasonIndex";

export const PortfolioDashboard: React.FC = () => {
  const { isError, error, isLoading } = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Portfolio Summary
          </CardTitle>
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
              <div className="flex flex-col gap-8">
                <AltcoinSeasonIndex />
                <PortfolioSummary />
                <div className="flex gap-8 w-full">
                  <div className="w-[60%]">
                    <PortfolioChart />
                  </div>
                  <div className="w-[40%]">
                    <AllocationChart />
                  </div>
                </div>
                <InvestmentsTable />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
