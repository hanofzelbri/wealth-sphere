export type StorageLocationType =
  | "hardwareWallet"
  | "softwareWallet"
  | "exchange";

export interface StorageLocation {
  id: string;
  userId: string;
  name: string;
  image: string;
  storageLocationType: StorageLocationType;
}

export interface CreateStorageLocationInput {
  name: string;
  image: string;
  storageLocationType: StorageLocationType;
}

export interface UpdateStorageLocationInput {
  id: string;
  name?: string;
  image?: string;
  storageLocationType?: StorageLocationType;
}

export interface DeleteStorageLocationInput {
  id: string;
}
