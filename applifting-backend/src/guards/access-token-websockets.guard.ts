import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { isTokenValid } from '../token-store';

// This is a custom guard for handling GraphQL requests
// For websockets req is different. Because of that we have 2 versions for HTTP and WebSockets
@Injectable()
export class AccessTokenGuardWebsockets implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    /**
     * For GraphQL, the execution context in NestJS uses GqlExecutionContext
     * rather than the default HTTP context. Because of that, we cannot use
     * context.switchToHttp(). It's undefined
     */
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const token = req.connectionParams['Authorization'];

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
