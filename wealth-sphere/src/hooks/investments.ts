import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { INVESTMENTS_API_PATH, INVESTMENTS_QUERY_KEY } from "./static";
import { api } from "@/lib/api";
import {
  CreateInvestmentInput,
  DeleteInvestmentInput,
  Investment,
  UpdateInvestmentInput,
} from "@/types/investment.types";

export function useInvestments() {
  return useQuery({
    queryKey: [INVESTMENTS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get<Investment[]>(INVESTMENTS_API_PATH);

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

export function useCreateInvestment(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createInput: CreateInvestmentInput) =>
      await api.post(INVESTMENTS_API_PATH, { id: createInput.coinId }),
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

export function useUpdateInvestment(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateInput: UpdateInvestmentInput) =>
      await api.put(`${INVESTMENTS_API_PATH}/${updateInput.id}`, updateInput),
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

export function useDeleteInvestment(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deleteInput: DeleteInvestmentInput) =>
      await api.delete(`${INVESTMENTS_API_PATH}/${deleteInput.id}`),
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
