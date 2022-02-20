import { Injectable } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../../../configuration/constants';
import { AuthService } from '../auth.service';
import { cookieExtractor } from '../extractors/cookie.extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly moduleReference: ModuleRef) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.accessTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload) {
    const contextID = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleReference.resolve(
      AuthService,
      contextID,
      {
        strict: true,
      },
    );

    const user = await authService.validateUser({
      email: payload.data.email,
      fromJwt: true,
    });

    return user;
  }
}
