import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PortfolioSummary } from "./PortfolioSummary";
import { InvestmentsTable } from "./InvestmentsTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { LoadingState } from "../utils/LoadingState";
import {
  useInvestments,
  useUpdateInvestmentLiveData,
} from "@/hooks/investments";
import { AddInvestment } from "./AddInvestment";
import PortfolioChart from "./PortfolioChart";

export const PortfolioDashboard: React.FC = () => {
  const investments = useInvestments();
  const updateInvestmentLiveData = useUpdateInvestmentLiveData();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portfolio Summary</CardTitle>
          <div className="flex gap-2">
            <AddInvestment />
            <Button
              variant="outline"
              size="icon"
              onClick={async () => await updateInvestmentLiveData.mutateAsync()}
              disabled={investments.isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {investments.isLoading ? (
            <LoadingState />
          ) : (
            <>
              <PortfolioSummary />
              <PortfolioChart />
              <InvestmentsTable />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
