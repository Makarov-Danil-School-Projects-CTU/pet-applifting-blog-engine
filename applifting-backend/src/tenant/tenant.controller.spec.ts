import { Test, TestingModule } from '@nestjs/testing';

import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('TenantController', () => {
  let controller: TenantController;
  let service: TenantService;

  // TODO: change fake service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        {
          provide: TenantService,
          useValue: {
            createTenant: jest.fn(), // Mock the createTenant method
            // Add other methods of TenantService if needed
          },
        },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    service = module.get<TenantService>(TenantService); // Get the mocked service
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
