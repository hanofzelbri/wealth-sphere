import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { investmentsControllerGetAllInvestmentsQueryKey } from "@/api-client/@tanstack/react-query.gen";

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
        // const isInvestmentMutation =
        //   response.config.url?.includes("/investments");

        // if (isInvestmentMutation) {
        await queryClient.invalidateQueries({
          queryKey: investmentsControllerGetAllInvestmentsQueryKey(),
        });
        // }
      }

      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
