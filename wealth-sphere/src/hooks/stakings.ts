import { api } from "@/lib/api";
import {
  CreateStakingInput,
  UpdateStakingInput,
  Staking,
  DeleteStakingInput,
} from "@/types/staking.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  FIVE_MINUTES,
  INVESTMENTS_QUERY_KEY,
  STAKINGS_API_PATH,
  STAKINGS_QUERY_KEY,
} from "./static";

export function useStakings() {
  return useQuery({
    queryKey: [STAKINGS_QUERY_KEY],
    staleTime: FIVE_MINUTES,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.get<Staking[]>(STAKINGS_API_PATH);

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

export function useCreateStaking(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStaking: CreateStakingInput) =>
      await api.post(STAKINGS_API_PATH, newStaking),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [STAKINGS_QUERY_KEY, INVESTMENTS_QUERY_KEY],
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

export function useUpdateStaking(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedStaking: UpdateStakingInput) =>
      await api.put(
        `${STAKINGS_API_PATH}/${updatedStaking.id}`,
        updatedStaking
      ),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [STAKINGS_QUERY_KEY, INVESTMENTS_QUERY_KEY],
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

export function useDeleteStaking(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deletedStakingInput: DeleteStakingInput) =>
      await api.delete(`${STAKINGS_API_PATH}/${deletedStakingInput.id}`),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [STAKINGS_QUERY_KEY, INVESTMENTS_QUERY_KEY],
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
