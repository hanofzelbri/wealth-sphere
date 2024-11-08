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

@Controller('stakings')
@UseGuards(JwtAuthGuard)
export class StakingsController {
  constructor(private readonly stakingsService: StakingsService) {}

  @Get()
  async getAllStakings(@User() userId: string): Promise<StakingResponseDto[]> {
    return await this.stakingsService.getAllStakings(userId);
  }

  @Get(':id')
  async getStakingById(
    @Param('id') id: string,
    @User() userId: string,
  ): Promise<StakingResponseDto | null> {
    return await this.stakingsService.getStakingById(id, userId);
  }

  @Post()
  async createStaking(
    @Body() data: CreateStakingDto,
    @User() userId: string,
  ): Promise<StakingResponseDto> {
    return await this.stakingsService.createStaking(userId, data);
  }

  @Put(':id')
  async updateStaking(
    @Param('id') id: string,
    @Body() data: UpdateStakingDto,
    @User() userId: string,
  ): Promise<StakingResponseDto> {
    return await this.stakingsService.updateStaking(id, userId, data);
  }

  @Delete(':id')
  async deleteStaking(
    @Param('id') id: string,
    @User() userId: string,
  ): Promise<void> {
    return this.stakingsService.deleteStaking(id, userId);
  }
}
