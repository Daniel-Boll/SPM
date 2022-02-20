import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export const extractCookieFromHeaders = ({
  headers,
  cookieName,
}: {
  headers: IncomingHttpHeaders;
  cookieName: string;
}) => {
  const cookies = headers.cookie;
  if (cookies) {
    return cookies
      .split(';')
      .find((cookie: string) => cookie.trim().startsWith(`${cookieName}=`))
      .split('=')[1];
  }
};

// Convert expiration like '1h/1m/1d' to milliseconds
export const convertJWTExpToMilliseconds = (expiration: string) => {
  const time = expiration.slice(0, -1);
  const unit = expiration.slice(-1);
  const timeInMilliseconds = Number(time) * 1000;
  switch (unit) {
    case 'h':
      return Math.floor(timeInMilliseconds * 60 * 60);
    case 'm':
      return Math.floor(timeInMilliseconds * 60);
    case 'd':
      return Math.floor(timeInMilliseconds * 60 * 60 * 24);
    default:
      return timeInMilliseconds;
  }
};
