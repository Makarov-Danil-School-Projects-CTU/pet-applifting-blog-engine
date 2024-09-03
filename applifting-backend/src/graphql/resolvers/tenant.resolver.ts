import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Tenant } from '../../entities/tenant.entity';
import { TenantService } from '../../tenant/tenant.service';
import { CreateTenantInput } from '../inputs/create-tenant.input';

@Resolver('Tenant')
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => Tenant, { name: 'getTenant' })
  getTenant(@Args('tenantId') tenantId: string): Promise<Tenant> {
    return this.tenantService.findOne(tenantId);
  }

  @Mutation(() => Tenant)
  createTenant(@Args('input') input: CreateTenantInput): Promise<Tenant> {
    return this.tenantService.create(input);
  }
}
