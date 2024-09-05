import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { Tenant } from '../entities/tenant.entity';
import { TenantService } from '../tenant/tenant.service';

// Rewrite a basic Request type from Express to add a currentUser field
declare global {
  namespace Express {
    interface Request {
      tenant?: Tenant;
    }
  }
}

@Injectable()
export class CurrentTenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;

    if (apiKey) {
      const tenant = await this.tenantService.findTenantByApiKey(apiKey);
      req.tenant = tenant;
    }

    // If using GraphQL, ensure the request is properly handled
    if (req.body && req.body.operationName) {
      // Attach tenant to the GraphQL context
      const context = req.body.context || {};
      context.tenant = req.tenant;
      req.body.context = context;
    }

    next();
  }
}
