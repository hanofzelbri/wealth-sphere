import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PortfolioSummary } from "./PortfolioSummary";
import { InvestmentsTable } from "./InvestmentsTable";
import { LoadingState } from "../utils/LoadingState";
import { useInvestments } from "@/hooks/investments";
import { AddInvestment } from "./AddInvestment";
import RefreshButton from "../utils/RefreshButton";

export const PortfolioDashboard: React.FC = () => {
  const investments = useInvestments();

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
          {investments.isLoading ? (
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
