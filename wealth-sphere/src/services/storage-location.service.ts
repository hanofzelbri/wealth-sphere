import { api } from "@/lib/api";
import {
  StorageLocation,
  CreateStorageLocationInput,
  UpdateStorageLocationInput,
} from "@/types/storage-location.types";
import { BehaviorSubject, Observable } from "rxjs";

const API_PATH = "/storage-locations";

export class StorageLocationService {
  private storageLocationsSubject = new BehaviorSubject<StorageLocation[]>([]);
  private currentStorageLocationSubject = new BehaviorSubject<StorageLocation | null>(null);

  getStorageLocations(): Observable<StorageLocation[]> {
    return this.storageLocationsSubject.asObservable();
  }

  getCurrentStorageLocation(): Observable<StorageLocation | null> {
    return this.currentStorageLocationSubject.asObservable();
  }

  async fetchStorageLocations(): Promise<void> {
    try {
      const response = await api.get<StorageLocation[]>(API_PATH);
      this.storageLocationsSubject.next(response.data);
    } catch (error) {
      console.error("Error fetching storage locations:", error);
      throw error;
    }
  }

  async fetchStorageLocationById(id: string): Promise<void> {
    try {
      const response = await api.get<StorageLocation>(`${API_PATH}/${id}`);
      this.currentStorageLocationSubject.next(response.data);
    } catch (error) {
      console.error(`Error fetching storage location with id ${id}:`, error);
      throw error;
    }
  }

  async addStorageLocation(newLocation: CreateStorageLocationInput): Promise<void> {
    try {
      await api.post(API_PATH, newLocation);
      await this.fetchStorageLocations(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding storage location:", error);
      throw error;
    }
  }

  async updateStorageLocation(
    locationId: string,
    updatedLocation: UpdateStorageLocationInput
  ): Promise<void> {
    try {
      await api.put(`${API_PATH}/${locationId}`, updatedLocation);
      await this.fetchStorageLocations(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating storage location:", error);
      throw error;
    }
  }

  async deleteStorageLocation(id: string): Promise<void> {
    try {
      await api.delete(`${API_PATH}/${id}`);
      await this.fetchStorageLocations(); // Refresh the list after deleting
      
      // Clear current location if it's the one being deleted
      if (this.currentStorageLocationSubject.value?.id === id) {
        this.currentStorageLocationSubject.next(null);
      }
    } catch (error) {
      console.error("Error deleting storage location:", error);
      throw error;
    }
  }
}

export const storageLocationService = new StorageLocationService();
