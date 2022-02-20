import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { jwtConstants } from 'src/configuration/constants';
import { extractCookieFromHeaders } from 'src/utils/http';
import { AuthService } from '../auth.service';
import { cookieExtractor } from '../extractors/cookie.extractor';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly moduleReference: ModuleRef,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    // Extract from which subdomain the request is coming from
    const subdomain = request.hostname.split('.')[0];

    const contextID = ContextIdFactory.getByRequest(request);

    const userService = await this.moduleReference.resolve(
      AuthService,
      contextID,
      {
        strict: false,
      },
    );

    try {
      // Extract and validate access token
      const accessToken = ExtractJwt.fromExtractors([cookieExtractor])(request);
      if (!accessToken)
        throw new UnauthorizedException('Access token is not set');

      const isValidAccessToken = await this.authService.validateToken(
        accessToken,
        jwtConstants.accessTokenSecret,
      );
      if (isValidAccessToken) return this.activate(context);

      // Extract and validate refresh token
      const refreshToken = extractCookieFromHeaders({
        headers: request.headers,
        cookieName: 'REFRESH_TOKEN',
      });
      if (!refreshToken)
        throw new UnauthorizedException('Refresh token is not set');

      const isValidRefreshToken = await this.authService.validateToken(
        refreshToken,
        jwtConstants.refreshTokenSecret,
      );
      if (!isValidRefreshToken)
        throw new UnauthorizedException('Refresh token is not valid');

      const user = await userService.forwardUserServiceCall(
        'findByRefreshToken',
        [refreshToken],
      );
      if (!user)
        throw new UnauthorizedException('Could not find user by refresh token');

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        this.authService.generateTokens(user, subdomain);

      await userService.forwardUserServiceCall('updateRefreshToken', [
        user._id,
        newRefreshToken,
      ]);

      response.setHeader('Set-Cookie', [
        `ACCESS_TOKEN=${newAccessToken}; HttpOnly; Path=/`,
        `REFRESH_TOKEN=${newRefreshToken}; HttpOnly; Path=/`,
      ]);

      return this.activate(context);
    } catch (err) {
      this.logger.error(err.message);
      response.clearCookie('ACCESS_TOKEN');
      response.clearCookie('REFRESH_TOKEN');
      return false;
    }
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
