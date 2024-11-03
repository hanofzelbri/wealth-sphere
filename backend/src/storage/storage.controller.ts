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
import { Storage, CreateStorageDto, UpdateStorageDto } from './dto/storage.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { mapStorageLocationType } from '../storage-locations/dto/storage-locations.dto';

@Controller('storages')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async findAll(@User('id') userId: string): Promise<Storage[]> {
    const storages = await this.storageService.findAll(userId);
    return storages.map((storage) => ({
      ...storage,
      location: {
        ...storage.location,
        storageLocationType: mapStorageLocationType(
          storage.location.storageLocationType,
        ),
      },
    }));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<Storage> {
    const storage = await this.storageService.findOne(id, userId);
    return {
      ...storage,
      location: {
        ...storage.location,
        storageLocationType: mapStorageLocationType(
          storage.location.storageLocationType,
        ),
      },
    };
  }

  @Get('investment/:investmentId')
  async findByInvestment(
    @Param('investmentId') investmentId: string,
    @User('id') userId: string,
  ): Promise<Storage[]> {
    const storages = await this.storageService.findByInvestment(
      investmentId,
      userId,
    );
    return storages.map((storage) => ({
      ...storage,
      location: {
        ...storage.location,
        storageLocationType: mapStorageLocationType(
          storage.location.storageLocationType,
        ),
      },
    }));
  }

  @Post()
  async create(
    @Body() createDto: CreateStorageDto,
    @User('id') userId: string,
  ): Promise<Storage> {
    const storage = await this.storageService.create(createDto, userId);
    return {
      ...storage,
      location: {
        ...storage.location,
        storageLocationType: mapStorageLocationType(
          storage.location.storageLocationType,
        ),
      },
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateDto: UpdateStorageDto,
  ): Promise<Storage> {
    const storage = await this.storageService.update(id, userId, updateDto);
    return {
      ...storage,
      location: {
        ...storage.location,
        storageLocationType: mapStorageLocationType(
          storage.location.storageLocationType,
        ),
      },
    };
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<Storage> {
    const storage = await this.storageService.delete(id, userId);
    return {
      ...storage,
      location: {
        ...storage.location,
        storageLocationType: mapStorageLocationType(
          storage.location.storageLocationType,
        ),
      },
    };
  }
}
