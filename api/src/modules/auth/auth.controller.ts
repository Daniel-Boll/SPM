import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  async login(@Request() { user, res }, @Headers() headers: any) {
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
}
