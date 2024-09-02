import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { isTokenValid } from 'src/token-store';

// This is a custom guard for handling GraphQL requests
@Injectable()
export class AccessTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    /**
     * For GraphQL, the execution context in NestJS uses GqlExecutionContext
     * rather than the default HTTP context. Because of that, we cannot use
     * context.switchToHttp(). It's undefined
     */
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
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
