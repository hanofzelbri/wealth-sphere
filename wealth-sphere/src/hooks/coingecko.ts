import { api } from "@/lib/api";
import {
  FIVE_MINUTES,
  INVESTMENTS_QUERY_KEY,
  COINGECKO_DATA_API_PATH,
  MARKET_DATA_QUERY_KEY,
} from "./static";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { MarketData } from "@/types/market-data.types";

export function useUpdateInvestmentLiveData(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      await api.post(`${COINGECKO_DATA_API_PATH}/update-coin-prices`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVESTMENTS_QUERY_KEY] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.log(error);
      onError?.();
    },
  });
}

export function useMarketData() {
  return useQuery({
    queryKey: [MARKET_DATA_QUERY_KEY],
    staleTime: FIVE_MINUTES,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.get<MarketData[]>(
        `${COINGECKO_DATA_API_PATH}/market-chart?days=90`
      );

      if (response.status === 200) {
        return response.data;
      }

      throw new Error(
        "Network response was not ok, status: " +
          response.status +
          " message: " +
          response.statusText
      );
    },
  });
}
export function useUpdateMarketData(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      await api.post(`${COINGECKO_DATA_API_PATH}/update-market-chart-data`),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [MARKET_DATA_QUERY_KEY] }),
      ])
        .then(() => onSuccess?.())
        .catch(console.error);
    },
    onError: (error: Error) => {
      console.log(error);
      onError?.();
    },
  });
}
