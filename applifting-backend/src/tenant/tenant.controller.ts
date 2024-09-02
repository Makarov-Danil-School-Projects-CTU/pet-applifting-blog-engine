import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Tenant } from '../entities/tenant.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { TenantResponseDto } from './dtos/tenant-response.dto';
import { TenantService } from './tenant.service';

@ApiTags('Tenants')
@Controller('tenants')
@UsePipes(new ValidationPipe({ whitelist: true }))
@Serialize(TenantResponseDto)
export class TenantController {
  constructor(private tenantServise: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiBody({
    type: CreateTenantDto,
    description: 'Data required to create a new tenant',
  })
  @ApiResponse({
    status: 201,
    description: 'The tenant has been successfully created.',
    type: TenantResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createTenant(@Body() body: CreateTenantDto): Promise<Tenant> {
    return this.tenantServise.create(body);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find a tenant by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the tenant to find',
  })
  @ApiResponse({
    status: 200,
    description: 'The tenant has been successfully retrieved.',
    type: TenantResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  findTenant(@Param('id') tenantId: string): Promise<Tenant> | null {
    return this.tenantServise.findOne(tenantId);
  }
}
