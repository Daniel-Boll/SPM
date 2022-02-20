import { Request } from 'express';
import { extractCookieFromHeaders } from 'src/utils/http';

export const cookieExtractor = (request: Request): string | null => {
  return request.cookies['ACCESS_TOKEN'];
};
