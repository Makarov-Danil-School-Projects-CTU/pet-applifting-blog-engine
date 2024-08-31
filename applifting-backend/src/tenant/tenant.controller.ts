import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Tenant } from 'src/entities/tenant.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { TenantResponseDto } from './dtos/tenant-response.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
@UsePipes(new ValidationPipe({ whitelist: true }))
@Serialize(TenantResponseDto)
export class TenantController {
  constructor(private tenantServise: TenantService) {}

  @Post()
  createTenant(@Body() body: CreateTenantDto): Promise<Tenant> {
    return this.tenantServise.create(body);
  }

  @Get('/:id')
  findTenant(@Param('id') tenantId: string): Promise<Tenant> {
    return this.tenantServise.findOne(tenantId);
  }
}
