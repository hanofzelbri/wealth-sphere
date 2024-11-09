import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StorageLocationsService } from './storage-locations.service';
import {
  CreateStorageLocationDto,
  UpdateStorageLocationDto,
  StorageLocationResponseDto,
} from './dto/storage-locations.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { StorageLocation } from '@prisma/client';

@Controller('storage-locations')
@UseGuards(JwtAuthGuard)
export class StorageLocationsController {
  constructor(
    private readonly storageLocationsService: StorageLocationsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Successful response',
    type: [StorageLocationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@User('id') userId: string): Promise<StorageLocation[]> {
    return await this.storageLocationsService.findAll(userId);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Successful response',
    type: StorageLocationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Storage location not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<StorageLocation> {
    return await this.storageLocationsService.findOne(id, userId);
  }

  @Post()
  @ApiOkResponse({
    description: 'Storage location created successfully',
    type: StorageLocationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(
    @User('id') userId: string,
    @Body() createDto: CreateStorageLocationDto,
  ): Promise<StorageLocation> {
    return await this.storageLocationsService.create(userId, createDto);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Storage location updated successfully',
    type: StorageLocationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Storage location not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateDto: UpdateStorageLocationDto,
  ): Promise<StorageLocation> {
    return await this.storageLocationsService.update(id, userId, updateDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Storage location deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Storage location not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async delete(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    return this.storageLocationsService.delete(id, userId);
  }
}
