import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { PasswordService } from './password.service';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post()
  async create(@Body() createPasswordDto: CreatePasswordDto) {
    return await this.passwordService.create(createPasswordDto);
  }

  @Get()
  async findAll() {
    return await this.passwordService.findAll();
  }

  @Get(':folder')
  async findByFolder(@Param('folder') folder: string) {
    console.log(folder);
    return await this.passwordService.findByFolder(folder);
  }
}
