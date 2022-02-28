import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from 'src/types/http';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  async login(@Req() { user, res }: RequestWithUser, @Headers() headers: any) {
    const { userData, tokens } = await this.authService.login({
      user,
      headers,
    });

    res.setHeader('Set-Cookie', [
      `ACCESS_TOKEN=${tokens.accessToken}; HttpOnly; Path=/`,
      `REFRESH_TOKEN=${tokens.refreshToken}; HttpOnly; Path=/`,
    ]);

    return {
      userData,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get('logout')
  async logout(@Req() { user, res }: RequestWithUser) {
    await this.authService.logout({
      user,
    });

    res.setHeader('Set-Cookie', [
      `ACCESS_TOKEN=; HttpOnly; Path=/`,
      `REFRESH_TOKEN=; HttpOnly; Path=/`,
    ]);

    return {
      message: 'Logout successful',
    };
  }
}
