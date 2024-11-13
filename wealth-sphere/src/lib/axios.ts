import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import {
  investmentsControllerGetAllInvestmentsQueryKey,
  portfolioControllerGetPortfolioHistoryQueryKey,
  stakingsControllerGetAllStakingPercentagesQueryKey,
} from "@/api-client/@tanstack/react-query.gen";

export const setupAxiosInstance = (
  baseURL: string,
  queryClient: QueryClient
) => {
  const axiosInstance = axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    async (response) => {
      if (
        response.config.method === "post" ||
        response.config.method === "put" ||
        response.config.method === "delete"
      ) {
        await queryClient.invalidateQueries({
          queryKey: investmentsControllerGetAllInvestmentsQueryKey(),
        });
        for (const days of [7, 30, 89, 3650]) {
          await queryClient.invalidateQueries({
            queryKey: portfolioControllerGetPortfolioHistoryQueryKey({
              query: { days },
            }),
          });
        }

        const isStakingMutation = response.config.url?.includes("/stakings");

        if (isStakingMutation) {
          await queryClient.invalidateQueries({
            queryKey: stakingsControllerGetAllStakingPercentagesQueryKey(),
          });
        }
      }

      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
