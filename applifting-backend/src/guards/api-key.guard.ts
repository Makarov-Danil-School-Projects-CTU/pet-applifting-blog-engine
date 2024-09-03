import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// This is a custom guard for handling GraphQL requests
// For websockets req is different. Because of that we have 2 versions for HTTP and WebSockets
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    /**
     * For GraphQL, the execution context in NestJS uses GqlExecutionContext
     * rather than the default HTTP context. Because of that, we cannot use
     * context.switchToHttp(). It's undefined
     */
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      throw new UnauthorizedException('x-api-key header is missing');
    }

    return true;
  }
}
