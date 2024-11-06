import { api } from "@/lib/api";
import {
  CreateStorageLocationInput,
  DeleteStorageLocationInput,
  StorageLocation,
  UpdateStorageLocationInput,
} from "@/types/storage-location.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  FIVE_MINUTES,
  INVESTMENTS_QUERY_KEY,
  STORAGE_LOCATIONS_API_PATH,
  STORAGE_LOCATIONS_QUERY_KEY,
} from "./static";

export function useStorageLocations() {
  return useQuery({
    queryKey: [STORAGE_LOCATIONS_QUERY_KEY],
    staleTime: FIVE_MINUTES,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.get<StorageLocation[]>(
        STORAGE_LOCATIONS_API_PATH
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

export function useCreateStorageLocation(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLocation: CreateStorageLocationInput) =>
      await api.post(STORAGE_LOCATIONS_API_PATH, newLocation),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [STORAGE_LOCATIONS_QUERY_KEY],
        }),
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

export function useUpdateStorageLocation(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedLocation: UpdateStorageLocationInput) =>
      await api.put(
        `${STORAGE_LOCATIONS_API_PATH}/${updatedLocation.id}`,
        updatedLocation
      ),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [STORAGE_LOCATIONS_QUERY_KEY],
        }),
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

export function useDeleteStorageLocation(
  onSuccess?: () => void,
  onError?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deletedStorageLocation: DeleteStorageLocationInput) =>
      await api.delete(
        `${STORAGE_LOCATIONS_API_PATH}/${deletedStorageLocation.id}`
      ),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [STORAGE_LOCATIONS_QUERY_KEY],
        }),
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
