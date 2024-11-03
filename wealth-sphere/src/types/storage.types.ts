export interface Storage {
  id: string;
  userId: string;
  investmentId: string;
  amount: number;
  storageLocationId: string;
  date: Date;
}

export interface CreateStorageInput {
  investmentId: string;
  amount: number;
  storageLocationId: string;
  date: Date;
}

export interface UpdateStorageInput {
  amount?: number;
  storageLocationId?: string;
  date?: Date;
}

export interface DeleteStorageInput {
  id: string;
}
