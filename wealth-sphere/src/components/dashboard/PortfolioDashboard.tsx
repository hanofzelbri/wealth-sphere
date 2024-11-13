import React from "react";
import { PortfolioSummary } from "./PortfolioSummary";
import { InvestmentsTable } from "./InvestmentsTable";
import { LoadingState } from "../utils/LoadingState";
import {
  investmentsControllerGetAllInvestmentsOptions,
  storageControllerGetAllocationByLocationOptions,
} from "@/api-client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { PortfolioHistoryChart } from "./PortfolioHistoryChart";
import AllocationChart from "./AllocationChart";
import { AltcoinSeasonIndex } from "./AltcoinSeasonIndex";
import { CBBIIndex } from "./CBBIIndex";
import { FearAndGreedIndex } from "./FearAndGreedIndex";

export const PortfolioDashboard: React.FC = () => {
  const { isError, error, isLoading } = useQuery({
    ...investmentsControllerGetAllInvestmentsOptions(),
  });

  const test = useQuery({
    ...storageControllerGetAllocationByLocationOptions(),
  });

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto space-y-8 p-2">
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <AltcoinSeasonIndex />
                <CBBIIndex />
              </div>
            </div>

            <div className="lg:col-span-4">
              <FearAndGreedIndex />
            </div>
          </div>

          <PortfolioSummary />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <PortfolioHistoryChart />
            </div>
            <div className="lg:col-span-4">
              <AllocationChart />
            </div>
          </div>

          <InvestmentsTable />
        </div>
      )}
    </div>
  );
};
