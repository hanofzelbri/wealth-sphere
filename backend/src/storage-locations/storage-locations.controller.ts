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
  mapStorageLocationType,
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
    const locations = await this.storageLocationsService.findAll(userId);
    return locations.map((location) => ({
      ...location,
      storageLocationType: mapStorageLocationType(location.storageLocationType),
    }));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<StorageLocation> {
    const location = await this.storageLocationsService.findOne(id, userId);
    return {
      ...location,
      storageLocationType: mapStorageLocationType(location.storageLocationType),
    };
  }

  @Post()
  async create(
    @User('id') userId: string,
    @Body() createDto: CreateStorageLocationDto,
  ): Promise<StorageLocation> {
    const location = await this.storageLocationsService.create(
      userId,
      createDto,
    );
    return {
      ...location,
      storageLocationType: mapStorageLocationType(location.storageLocationType),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateDto: UpdateStorageLocationDto,
  ): Promise<StorageLocation> {
    const location = await this.storageLocationsService.update(
      id,
      userId,
      updateDto,
    );
    return {
      ...location,
      storageLocationType: mapStorageLocationType(location.storageLocationType),
    };
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    return this.storageLocationsService.delete(id, userId);
  }
}
