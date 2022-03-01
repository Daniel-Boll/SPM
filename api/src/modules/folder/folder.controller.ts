import { Body, Query, Param, Controller, Delete, Post, Get, Patch, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createFolderDto: CreateFolderDto) {
    const folder = await this.folderService.create(createFolderDto);
    return folder;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const foundFolders = await this.folderService.findAll();
    return foundFolders;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':name')
  async findOne(@Param('name') name: string) {
    const folder = await this.folderService.findOne(name);
    return folder;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':name')
  async update(@Param('name') name: string, @Body() updateFolderDto: UpdateFolderDto) {
    return this.folderService.update(name, updateFolderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":name")
  async delete(@Param('name') name: string) {
    return this.folderService.remove(name);
  }
}
