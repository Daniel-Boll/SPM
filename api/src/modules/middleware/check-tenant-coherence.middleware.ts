import {
  Injectable,
  NestMiddleware,
  NotAcceptableException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as JWT from 'jsonwebtoken';
import { jwtConstants } from '../../configuration/constants';

@Injectable()
export class CheckTenantCoherenceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check if both subdomain and header authorization are the same
    const authorization = req.headers.authorization;
    // Extract the http://${domain}.anythingelse.com
    const urlDomain = req.headers.host.split('.')[0];

    const { subdomain: headerDomain }: any = authorization.includes('Bearer')
      ? JWT.verify(
          authorization.replace('Bearer ', ''),
          jwtConstants.accessTokenSecret,
        )
      : {
          subdomain: authorization,
        };

    if (headerDomain !== urlDomain) {
      throw new NotAcceptableException(
        'The authorization does not match the subdomain that the request is comming from',
      );
    }

    next();
  }
}
