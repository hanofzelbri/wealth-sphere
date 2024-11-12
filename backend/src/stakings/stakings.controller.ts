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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { StakingsService } from './stakings.service';
import { CreateStakingDto, UpdateStakingDto } from './dto/staking.dto';
import { ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { Staking } from '@prisma/client';
import { StakingEntity } from 'src/entities/staking.entity';

@Controller('stakings')
@UseGuards(JwtAuthGuard)
export class StakingsController {
  constructor(private readonly stakingsService: StakingsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Successful response',
    type: [StakingEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllStakings(@User() userId: string): Promise<Staking[]> {
    return await this.stakingsService.getAllStakings(userId);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Successful response',
    type: StakingEntity,
  })
  @ApiResponse({ status: 404, description: 'Staking not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getStakingById(
    @Param('id') id: string,
    @User() userId: string,
  ): Promise<Staking> {
    return await this.stakingsService.getStakingById(id, userId);
  }

  @Post()
  @ApiOkResponse({
    description: 'Staking created successfully',
    type: StakingEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createStaking(
    @Body() data: CreateStakingDto,
    @User() userId: string,
  ): Promise<Staking> {
    return await this.stakingsService.createStaking(userId, data);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Staking updated successfully',
    type: StakingEntity,
  })
  @ApiResponse({ status: 404, description: 'Staking not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateStaking(
    @Param('id') id: string,
    @Body() data: UpdateStakingDto,
    @User() userId: string,
  ): Promise<Staking> {
    return await this.stakingsService.updateStaking(id, userId, data);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Staking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Staking not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteStaking(
    @Param('id') id: string,
    @User() userId: string,
  ): Promise<void> {
    await this.stakingsService.deleteStaking(id, userId);
  }
}
