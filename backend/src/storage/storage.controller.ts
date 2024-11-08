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
import {
  StorageResponseDto,
  CreateStorageDto,
  UpdateStorageDto,
} from './dto/storage.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('storages')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async findAll(@User('id') userId: string): Promise<StorageResponseDto[]> {
    return await this.storageService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<StorageResponseDto> {
    return await this.storageService.findOne(id, userId);
  }

  @Get('investment/:investmentId')
  async findByInvestment(
    @Param('investmentId') investmentId: string,
    @User('id') userId: string,
  ): Promise<StorageResponseDto[]> {
    return await this.storageService.findByInvestment(investmentId, userId);
  }

  @Post()
  async create(
    @Body() createDto: CreateStorageDto,
    @User('id') userId: string,
  ): Promise<StorageResponseDto> {
    return await this.storageService.create(userId, createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateDto: UpdateStorageDto,
  ): Promise<StorageResponseDto> {
    return await this.storageService.update(id, userId, updateDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<StorageResponseDto> {
    return await this.storageService.delete(id, userId);
  }
}
