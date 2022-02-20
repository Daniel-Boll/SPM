import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
    });
  }

  async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<any> {
    const contextID = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextID);

    const user = await authService.validateUser({
      email,
      password,
      fromJwt: false,
    });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
