import { Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/configuration/constants';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({
    email,
    password = null,
    fromJwt = false,
  }: {
    email: string;
    password?: string;
    fromJwt?: boolean;
  }): Promise<User | null> {
    const user = await this.userService.find({ email });

    if (!user) return null;
    if (fromJwt) return user;

    if (password === user.masterPassword) return user;
    if (await bcrypt.compare(password, user.masterPassword)) return user;
  }

  // Check if a token has expired
  async validateToken(token: string, secret: string) {
    try {
      await this.jwtService.verify(token, { secret });
    } catch (err) {
      return false;
    }

    return true;
  }

  generateTokens(user: User, subdomain: string) {
    const accessToken = this.jwtService.sign(
      {
        sub: user._id,
        data: {
          subdomain,
          name: user.name,
          email: user.email,
        },
      },
      {
        expiresIn: jwtConstants.accessTokenExpiration,
        secret: jwtConstants.accessTokenSecret,
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user._id },
      {
        expiresIn: jwtConstants.refreshTokenExpiration,
        secret: jwtConstants.refreshTokenSecret,
      },
    );

    return { accessToken, refreshToken };
  }

  async login({ user, headers }: { user: User; headers: Headers }) {
    const tokens = this.generateTokens(user, headers['authorization']);

    await this.userService.updateRefreshToken(user._id, tokens.refreshToken);

    return {
      userData: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      tokens,
    };
  }

  async logout({ user }: { user: User }) {
    return this.userService.updateRefreshToken(user._id, null);
  }

  async forwardUserServiceCall(method: string, args: any[]) {
    return await this.userService[method](...args);
  }
}
