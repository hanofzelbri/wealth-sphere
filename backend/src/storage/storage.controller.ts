import {
  Controller,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Put,
  Post,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateStorageDto, UpdateStorageDto } from './dto/storage.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { StorageEntity } from 'src/entities/storage.entity';
import { StorageAllocationEntity } from 'src/entities/storage-allocation.entity';

@Controller('storages')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  @ApiOkResponse({
    description: 'Successful response',
    type: [StorageEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@User() userId: string): Promise<StorageEntity[]> {
    return await this.storageService.findAll(userId);
  }

  @Post()
  @ApiOkResponse({
    description: 'Storage created successfully',
    type: StorageEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(
    @Body() createDto: CreateStorageDto,
    @User() userId: string,
  ): Promise<StorageEntity> {
    return await this.storageService.create(userId, createDto);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Storage updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Storage not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @User() userId: string,
    @Body() updateDto: UpdateStorageDto,
  ): Promise<void> {
    await this.storageService.update(id, userId, updateDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Storage deleted successfully' })
  @ApiResponse({ status: 404, description: 'Storage not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async delete(@Param('id') id: string, @User() userId: string): Promise<void> {
    await this.storageService.delete(id, userId);
  }

  @Get('allocation')
  @ApiOkResponse({
    description: 'Get storage allocation by location',
    type: [StorageAllocationEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllocationByLocation(
    @User() userId: string,
  ): Promise<StorageAllocationEntity[]> {
    return await this.storageService.getAllocationByLocation(userId);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Successful response',
    type: StorageEntity,
  })
  @ApiResponse({ status: 404, description: 'Storage not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(
    @Param('id') id: string,
    @User() userId: string,
  ): Promise<StorageEntity> {
    return await this.storageService.findOne(id, userId);
  }
}
