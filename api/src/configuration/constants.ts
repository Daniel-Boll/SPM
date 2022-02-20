import { convertJWTExpToMilliseconds } from 'src/utils/http';

const ACCESS_TOKEN_EXPIRATION = '1m';
const REFRESH_TOKEN_EXPIRATION = '1d';

export const jwtConstants = {
  accessTokenSecret: `${process.env.JWT_ACCESS_TOKEN_SECRET}`,
  accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
  accessTokenCookieMaxAge: convertJWTExpToMilliseconds(ACCESS_TOKEN_EXPIRATION),
  refreshTokenSecret: `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
  refreshTokenExpiration: REFRESH_TOKEN_EXPIRATION,
  refreshTokenCookieMaxAge: convertJWTExpToMilliseconds(
    REFRESH_TOKEN_EXPIRATION,
  ),
};
