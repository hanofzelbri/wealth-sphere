export interface StorageLocation {
  id: string;
  userId: string;
  name: string;
  image: string;
}

export interface CreateStorageLocationInput {
  name: string;
  image: string;
}

export interface UpdateStorageLocationInput {
  name?: string;
  image?: string;
}

export interface DeleteStorageLocationInput {
  id: string;
}
