import { StorageLocation } from "./storage-location.types";

export interface Storage {
  id: string;
  userId: string;
  investmentId: string;
  amount: number;
  location: StorageLocation;
  date: Date;
}

export interface CreateStorageInput {
  investmentId: string;
  amount: number;
  storageLocationId: string;
  date: Date;
}

export interface UpdateStorageInput {
  id: string;
  amount?: number;
  storageLocationId?: string;
  date?: Date;
}

export interface DeleteStorageInput {
  id: string;
}
