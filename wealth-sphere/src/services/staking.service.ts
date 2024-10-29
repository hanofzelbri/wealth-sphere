import {
  Staking,
  CreateStakingInput,
  UpdateStakingInput,
} from "@/types/staking.types";
import { api } from "@/lib/api";

export const stakingService = {
  async addStaking(staking: CreateStakingInput): Promise<Staking> {
    const response = await api.post("/stakings", staking);
    return response.data;
  },

  async updateStaking(
    id: string,
    staking: UpdateStakingInput
  ): Promise<Staking> {
    const response = await api.put(`/stakings/${id}`, staking);
    return response.data;
  },

  async deleteStaking(id: string): Promise<void> {
    await api.delete(`/stakings/${id}`);
  },
};
