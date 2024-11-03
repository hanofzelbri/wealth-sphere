import { api } from "@/lib/api";
import {
  Storage,
  CreateStorageInput,
  UpdateStorageInput,
} from "@/types/storage.types";
import { BehaviorSubject, Observable } from "rxjs";

const API_PATH = "/storages";

export class StorageService {
  private storagesSubject = new BehaviorSubject<Storage[]>([]);

  getStorages(): Observable<Storage[]> {
    return this.storagesSubject.asObservable();
  }

  async fetchStorages(): Promise<void> {
    try {
      const response = await api.get<Storage[]>(API_PATH);
      this.storagesSubject.next(response.data);
    } catch (error) {
      console.error("Error fetching storages:", error);
      throw error;
    }
  }

  async addStorage(newStorage: CreateStorageInput): Promise<void> {
    try {
      await api.post(API_PATH, newStorage);
    } catch (error) {
      console.error("Error adding storage:", error);
      throw error;
    }
  }

  async updateStorage(
    storageId: string,
    updatedStorage: UpdateStorageInput
  ): Promise<void> {
    try {
      await api.put(`${API_PATH}/${storageId}`, updatedStorage);
    } catch (error) {
      console.error("Error updating storage:", error);
      throw error;
    }
  }

  async deleteStorage(id: string): Promise<void> {
    try {
      await api.delete(`${API_PATH}/${id}`);
    } catch (error) {
      console.error("Error deleting storage:", error);
      throw error;
    }
  }
}

export const storageService = new StorageService(); 
