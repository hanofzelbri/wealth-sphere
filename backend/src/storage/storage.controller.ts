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
import { StorageService } from './storage.service';
import { CreateStorageDto, UpdateStorageDto } from './dto/storage.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { Storage } from '@prisma/client';
import { StorageEntity } from 'src/entities/storage.entity';

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
  async findAll(@User('id') userId: string): Promise<Storage[]> {
    return await this.storageService.findAll(userId);
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
    @User('id') userId: string,
  ): Promise<Storage> {
    return await this.storageService.findOne(id, userId);
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
    @User('id') userId: string,
  ): Promise<Storage> {
    return await this.storageService.create(userId, createDto);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Storage updated successfully',
    type: StorageEntity,
  })
  @ApiResponse({ status: 404, description: 'Storage not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
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
  async delete(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    await this.storageService.delete(id, userId);
  }
}
