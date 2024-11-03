import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Staking } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { StakingsService } from './stakings.service';
import {
  CreateStakingDto,
  UpdateStakingDto,
  StakingResponseDto,
} from './dto/staking.dto';
import { mapStorageLocationType } from '../storage-locations/dto/storage-locations.dto';

@Controller('stakings')
@UseGuards(JwtAuthGuard)
export class StakingsController {
  constructor(private readonly stakingsService: StakingsService) {}

  @Get()
  async getAllStakings(@User() user: string): Promise<StakingResponseDto[]> {
    const stakings = await this.stakingsService.getAllStakings(user);
    return stakings.map((staking) => ({
      ...staking,
      location: {
        ...staking.location,
        storageLocationType: mapStorageLocationType(
          staking.location.storageLocationType,
        ),
      },
    }));
  }

  @Get(':id')
  async getStakingById(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<StakingResponseDto | null> {
    const staking = await this.stakingsService.getStakingById(id, user);
    if (!staking) return null;

    return {
      ...staking,
      location: {
        ...staking.location,
        storageLocationType: mapStorageLocationType(
          staking.location.storageLocationType,
        ),
      },
    };
  }

  @Post()
  async createStaking(
    @Body() data: CreateStakingDto,
    @User() user: string,
  ): Promise<StakingResponseDto> {
    const staking = await this.stakingsService.createStaking(data, user);
    return {
      ...staking,
      location: {
        ...staking.location,
        storageLocationType: mapStorageLocationType(
          staking.location.storageLocationType,
        ),
      },
    };
  }

  @Put(':id')
  async updateStaking(
    @Param('id') id: string,
    @Body() data: UpdateStakingDto,
    @User() user: string,
  ): Promise<StakingResponseDto> {
    const staking = await this.stakingsService.updateStaking(id, data, user);
    return {
      ...staking,
      amount: staking.amount,
      location: {
        ...staking.location,
        storageLocationType: mapStorageLocationType(
          staking.location.storageLocationType,
        ),
      },
    };
  }

  @Delete(':id')
  async deleteStaking(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<Staking> {
    return this.stakingsService.deleteStaking(id, user);
  }
}
