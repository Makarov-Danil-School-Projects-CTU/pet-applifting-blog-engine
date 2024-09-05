import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';

import { Tenant } from '../entities/tenant.entity';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { TenantService } from './tenant.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockTenant = {
  tenantId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
  apiKey: 'test-api-key',
  name: 'Test Tenant',
  password: 'test-password',
  createdAt: new Date(),
  lastUsedAt: new Date(),
  articles: [],
  comments: [],
  commentVotes: [],
  image: null,
} as Tenant;

const mockExternalApiResponse = {
  tenantId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
  apiKey: 'abc123',
  name: 'Test Tenant',
  createdAt: new Date(),
  lastUsedAt: null,
};

const mockTenantRepository = {
  find: jest.fn(),
  create: jest.fn().mockImplementation((dto) => ({
    ...dto,
    tenantId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
    createdAt: new Date(),
    lastUsedAt: null,
    articles: [],
    comments: [],
    image: null,
  })),
  save: jest.fn().mockImplementation((tenant) => Promise.resolve(tenant)), // Return the tenant that was passed in
  findOne: jest.fn(),
};

describe('TenantService', () => {
  let service: TenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new tenant', async () => {
    const createTenantDto: CreateTenantDto = {
      name: mockTenant.name,
      password: mockTenant.password,
    };

    mockTenantRepository.find.mockResolvedValue([]); // Mock no tenants exist with the same name
    mockedAxios.post.mockResolvedValue({ data: mockExternalApiResponse }); // Mock Axios response

    const result = await service.create(createTenantDto);

    expect(mockTenantRepository.find).toHaveBeenCalledWith({
      where: { name: mockTenant.name },
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://fullstack.exercise.applifting.cz/tenants',
      {
        name: mockTenant.name,
        password: expect.any(String),
      },
    );
    expect(mockTenantRepository.save).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toEqual({
      tenantId: mockExternalApiResponse.tenantId,
      apiKey: mockExternalApiResponse.apiKey,
      name: mockExternalApiResponse.name,
      password: expect.any(String),
      createdAt: expect.any(Date),
      comments: [],
      image: null,
      articles: [],
      lastUsedAt: null,
    });
  });

  it('should throw BadRequestException if tenant name is already in use', async () => {
    mockTenantRepository.find.mockResolvedValue([mockTenant]); // Mock a tenant with the same name exists

    await expect(
      service.create({ name: 'Test Tenant', password: 'password123' }),
    ).rejects.toThrow(BadRequestException); // Expect a BadRequestException to be thrown
  });

  it('should find a tenant by ID', async () => {
    const tenantId = '1';
    mockTenantRepository.findOne.mockResolvedValue(mockTenant); // Mock tenant found by ID

    const result = await service.findOne(tenantId);

    expect(mockTenantRepository.findOne).toHaveBeenCalledWith({
      where: { tenantId },
      relations: ['articles'],
    });
    expect(result).toEqual(mockTenant); // The found tenant should match the mockTenant object
  });

  it('should return null if tenant ID is not provided', async () => {
    const result = await service.findOne(null); // Null tenant ID

    expect(result).toBeNull(); // Expect result to be null
  });

  it('should throw NotFoundException if tenant is not found', async () => {
    const tenantId = 'non-existing-id';
    mockTenantRepository.findOne.mockResolvedValue(null); // Mock no tenant found with given ID

    await expect(service.findOne(tenantId)).resolves.toBeNull(); // Since findOne returns null, expect it to resolve to null
  });
});
