import { BehaviorSubject, Observable } from "rxjs";
import { Staking } from "@/types";
import { ApiService, API_BASE_URL } from "./api.service";
import axios from "axios";

const API_URL = `${API_BASE_URL}/investments`;

export class StakingService extends ApiService {
  private stakingsSubject = new BehaviorSubject<Staking[]>([]);

  getStakings(): Observable<Staking[]> {
    return this.stakingsSubject.asObservable();
  }

  async fetchStakingsByInvestmentId(investmentId: string): Promise<void> {
    try {
      const response = await axios.get<Staking[]>(
        `${API_URL}/${investmentId}/stakings`,
        this.getHeaders()
      );
      this.stakingsSubject.next(response.data);
    } catch (error) {
      this.handleError(error, "Error fetching stakings");
    }
  }

  async addStaking(investmentId: string, staking: Omit<Staking, 'id'>): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/${investmentId}/stakings`,
        staking,
        this.getHeaders()
      );
      await this.fetchStakingsByInvestmentId(investmentId);
    } catch (error) {
      this.handleError(error, "Error adding staking");
    }
  }

  async updateStaking(investmentId: string, stakingId: string, staking: Staking): Promise<void> {
    try {
      await axios.put(
        `${API_URL}/${investmentId}/stakings/${stakingId}`,
        staking,
        this.getHeaders()
      );
      await this.fetchStakingsByInvestmentId(investmentId);
    } catch (error) {
      this.handleError(error, "Error updating staking");
    }
  }

  async deleteStaking(investmentId: string, stakingId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/${investmentId}/stakings/${stakingId}`,
        this.getHeaders()
      );
      await this.fetchStakingsByInvestmentId(investmentId);
    } catch (error) {
      this.handleError(error, "Error deleting staking");
    }
  }
}

export const stakingService = new StakingService();
