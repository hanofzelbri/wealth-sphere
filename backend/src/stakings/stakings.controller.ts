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
  async getAllStakings(@User() user: string): Promise<StakingResponseDto[]> {
    return this.stakingsService.getAllStakings(user);
  }

  @Get(':id')
  async getStakingById(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<StakingResponseDto | null> {
    return this.stakingsService.getStakingById(id, user);
  }

  @Post()
  async createStaking(
    @Body() data: CreateStakingDto,
    @User() user: string,
  ): Promise<StakingResponseDto> {
    return this.stakingsService.createStaking(data, user);
  }

  @Put(':id')
  async updateStaking(
    @Param('id') id: string,
    @Body() data: UpdateStakingDto,
    @User() user: string,
  ): Promise<StakingResponseDto> {
    return this.stakingsService.updateStaking(id, data, user);
  }

  @Delete(':id')
  async deleteStaking(
    @Param('id') id: string,
    @User() user: string,
  ): Promise<Staking> {
    return this.stakingsService.deleteStaking(id, user);
  }
}
