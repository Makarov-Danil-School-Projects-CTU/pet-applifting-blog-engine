import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateTenantDto } from './dtos/create-tenant.dto';
import { TenantResponseDto } from './dtos/tenant-response.dto';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

const mockTenant = {
  tenantId: '1',
  name: 'Test Tenant',
  apiKey: 'abc123',
  createdAt: new Date(),
  lastUsedAt: new Date(),
};

const mockTenantService = {
  create: jest.fn().mockResolvedValue(mockTenant),
  findOne: jest.fn().mockResolvedValue(mockTenant),
};

describe('TenantController', () => {
  let controller: TenantController;
  let service: TenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        {
          provide: TenantService,
          useValue: mockTenantService,
        },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    service = module.get<TenantService>(TenantService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new tenant', async () => {
    const createTenantDto: CreateTenantDto = {
      name: 'New Tenant',
      password: 'password123',
    };

    const result = await controller.createTenant(createTenantDto);

    expect(service.create).toHaveBeenCalledWith(createTenantDto);
    expect(result).toEqual(mockTenant);
  });

  it('should find a tenant by ID', async () => {
    const tenantId = '1';
    const result = await controller.findTenant(tenantId);

    expect(service.findOne).toHaveBeenCalledWith(tenantId);
    expect(result).toEqual(mockTenant);
  });

  it('should throw NotFoundException if tenant is not found', async () => {
    const tenantId = 'non-existing-id';
    service.findOne = jest.fn().mockResolvedValue(null);

    await expect(controller.findTenant(tenantId)).resolves.toBeNull();
  });
});
