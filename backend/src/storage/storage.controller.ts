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

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async findAll(@User('id') userId: string): Promise<Storage[]> {
    return this.storageService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<Storage> {
    return this.storageService.findOne(id, userId);
  }

  @Get('investment/:investmentId')
  async findByInvestment(
    @Param('investmentId') investmentId: string,
    @User('id') userId: string,
  ): Promise<Storage[]> {
    return this.storageService.findByInvestment(investmentId, userId);
  }

  @Post()
  async create(
    @User('id') userId: string,
    @Body() createDto: CreateStorageDto,
  ): Promise<Storage> {
    return this.storageService.create(userId, createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateDto: UpdateStorageDto,
  ): Promise<Storage> {
    return this.storageService.update(id, userId, updateDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    return this.storageService.delete(id, userId);
  }
}
