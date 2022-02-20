import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordEncryptionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PasswordEncryptionMiddleware.name);

  async use(req: Request, _: any, next: NextFunction) {
    this.logger.log('Encrypting password');
    const { name, masterPassword } = req.body.user ? req.body.user : req.body;

    if (name && masterPassword)
      if (req.body.user)
        req.body.user.masterPassword = await bcrypt.hash(masterPassword, 10);
      else req.body.masterPassword = await bcrypt.hash(masterPassword, 10);

    next();
  }
}
