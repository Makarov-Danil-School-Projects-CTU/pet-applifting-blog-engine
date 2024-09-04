import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// A parameter decorator which returns an actual user
export const CurrentTenant = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.tenant;
  },
);

// A parameter decorator for GraphQL which returns the current tenant
export const CurrentTenantGraphQL = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.tenant;
  },
);
