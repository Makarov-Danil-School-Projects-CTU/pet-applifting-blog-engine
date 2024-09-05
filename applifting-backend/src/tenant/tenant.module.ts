import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tenant } from '../entities/tenant.entity';
import { TenantResolver } from '../graphql/resolvers/tenant.resolver';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService, TenantResolver],
  controllers: [TenantController],
  exports: [TenantService],
})
export class TenantModule {}
