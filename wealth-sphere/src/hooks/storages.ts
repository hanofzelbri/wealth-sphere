import { api } from "@/lib/api";
import {
  CreateStorageInput,
  UpdateStorageInput,
  Storage,
  DeleteStorageInput,
} from "@/types/storage.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  FIVE_MINUTES,
  INVESTMENTS_QUERY_KEY,
  STORAGES_API_PATH,
  STORAGES_QUERY_KEY,
} from "./static";

export function useStorages() {
  return useQuery({
    queryKey: [STORAGES_QUERY_KEY],
    staleTime: FIVE_MINUTES,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.get<Storage[]>(STORAGES_API_PATH);

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

export function useCreateStorage(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStorage: CreateStorageInput) =>
      await api.post(STORAGES_API_PATH, newStorage),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [STORAGES_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [INVESTMENTS_QUERY_KEY] }),
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

export function useUpdateStorage(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateStorageInput: UpdateStorageInput) =>
      await api.put(
        `${STORAGES_API_PATH}/${updateStorageInput.id}`,
        updateStorageInput
      ),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [STORAGES_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [INVESTMENTS_QUERY_KEY] }),
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

export function useDeleteStorage(onSuccess?: () => void, onError?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deleteStorageInput: DeleteStorageInput) =>
      await api.delete(`${STORAGES_API_PATH}/${deleteStorageInput.id}`),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [STORAGES_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [INVESTMENTS_QUERY_KEY] }),
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
