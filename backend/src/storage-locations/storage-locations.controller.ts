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
  StorageLocation,
  CreateStorageLocationDto,
  UpdateStorageLocationDto,
} from './dto/storage-locations.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('storage-locations')
@UseGuards(JwtAuthGuard)
export class StorageLocationsController {
  constructor(
    private readonly storageLocationsService: StorageLocationsService,
  ) {}

  @Get()
  async findAll(@User('id') userId: string): Promise<StorageLocation[]> {
    return this.storageLocationsService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<StorageLocation> {
    return this.storageLocationsService.findOne(id, userId);
  }

  @Post()
  async create(
    @User('id') userId: string,
    @Body() createDto: CreateStorageLocationDto,
  ): Promise<StorageLocation> {
    return this.storageLocationsService.create(userId, createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateDto: UpdateStorageLocationDto,
  ): Promise<StorageLocation> {
    return this.storageLocationsService.update(id, userId, updateDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    return this.storageLocationsService.delete(id, userId);
  }
}
