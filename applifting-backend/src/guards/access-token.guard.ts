import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { isTokenValid } from 'src/token-store';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;
    const token = req.headers['authorization'];

    if (!token) {
      throw new HttpException(
        'Missing Authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!isTokenValid(token)) {
      throw new HttpException(
        'Invalid or expired access token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
