import { api } from "@/lib/api";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  Transaction,
} from "@/types/transaction.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  FIVE_MINUTES,
  INVESTMENTS_QUERY_KEY,
  TRANSACTIONS_API_PATH,
  TRANSACTIONS_QUERY_KEY,
} from "./static";
import { DeleteStorageInput } from "@/types/storage.types";

export function useTransactions() {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY],
    staleTime: FIVE_MINUTES,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.get<Transaction[]>(TRANSACTIONS_API_PATH);

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

export function useTransactionsForInvestmentId(investmentId: string) {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, investmentId],
    staleTime: FIVE_MINUTES,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.get<Transaction[]>(
        `${TRANSACTIONS_API_PATH}/investment/${investmentId}`
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

export function useCreateTransaction(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTransaction: CreateTransactionInput) =>
      await api.post(TRANSACTIONS_API_PATH, newTransaction),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEY, INVESTMENTS_QUERY_KEY],
        })
        .then(onSuccess ?? undefined)
        .catch(console.error);
    },
    onError: (error: Error) => {
      console.log(error);
      onError?.();
    },
  });
}

export function useUpdateTransaction(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedTransaction: UpdateTransactionInput) =>
      await api.put(
        `${TRANSACTIONS_API_PATH}/${updatedTransaction.id}`,
        updatedTransaction
      ),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEY, INVESTMENTS_QUERY_KEY],
        })
        .then(onSuccess ?? undefined)
        .catch(console.error);
    },
    onError: (error: Error) => {
      console.log(error);
      onError?.();
    },
  });
}

export function useDeleteTransaction(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deleteTransaction: DeleteStorageInput) =>
      await api.delete(`${TRANSACTIONS_API_PATH}/${deleteTransaction.id}`),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEY, INVESTMENTS_QUERY_KEY],
        })
        .then(onSuccess ?? undefined)
        .catch(console.error);
    },
    onError: (error: Error) => {
      console.log(error);
      onError?.();
    },
  });
}
