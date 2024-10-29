import { api } from "@/lib/api";
import {
  Staking,
  CreateStakingInput,
  UpdateStakingInput,
} from "@/types/staking.types";
import { BehaviorSubject, Observable } from "rxjs";

const API_PATH = "/stakings";

export class StakingService {
  private stakingsSubject = new BehaviorSubject<Staking[]>([]);
  private currentStakingSubject = new BehaviorSubject<Staking | null>(null);

  getStakings(): Observable<Staking[]> {
    return this.stakingsSubject.asObservable();
  }

  getCurrentStaking(): Observable<Staking | null> {
    return this.currentStakingSubject.asObservable();
  }

  async fetchStakings(): Promise<void> {
    try {
      const response = await api.get<Staking[]>(API_PATH);
      this.stakingsSubject.next(response.data);
    } catch (error) {
      console.error("Error fetching stakings:", error);
      throw error;
    }
  }

  async fetchStakingById(id: string): Promise<void> {
    try {
      const response = await api.get<Staking>(`${API_PATH}/${id}`);
      this.currentStakingSubject.next(response.data);
    } catch (error) {
      console.error(`Error fetching staking with id ${id}:`, error);
      throw error;
    }
  }

  async addStaking(newStaking: CreateStakingInput): Promise<void> {
    try {
      await api.post(API_PATH, newStaking);
      await this.fetchStakings();
    } catch (error) {
      console.error("Error adding staking:", error);
      throw error;
    }
  }

  async updateStaking(
    stakingId: string,
    updatedStaking: UpdateStakingInput
  ): Promise<void> {
    try {
      await api.put(`${API_PATH}/${stakingId}`, updatedStaking);
      await this.fetchStakings();
    } catch (error) {
      console.error("Error updating staking:", error);
      throw error;
    }
  }

  async deleteStaking(id: string): Promise<void> {
    try {
      await api.delete(`${API_PATH}/${id}`);
      await this.fetchStakings();
    } catch (error) {
      console.error("Error deleting staking:", error);
      throw error;
    }
  }
}

export const stakingService = new StakingService();
