import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello(): string {
    return 'Working';
  }
}
