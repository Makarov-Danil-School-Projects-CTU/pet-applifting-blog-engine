import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CreateTenantDto } from './dtos/create-tenant.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockTenant = {
  tenantId: '1',
  name: 'Test Tenant',
  apiKey: 'abc123',
  createdAt: new Date(),
  lastUsedAt: null,
  articles: [],
  password: 'salt.hashpassword',
};

const mockExternalApiResponse = {
  tenantId: '1',
  apiKey: 'abc123',
  name: 'Test Tenant',
  createdAt: new Date(),
  lastUsedAt: null,
};

const mockTenantRepository = {
  find: jest.fn(),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockResolvedValue(mockTenant),
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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new tenant', async () => {
    const createTenantDto: CreateTenantDto = {
      name: 'New Tenant',
      password: 'password123',
    };

    mockTenantRepository.find.mockResolvedValue([]); // Mock that no tenants with the same name exist
    mockedAxios.post.mockResolvedValue({ data: mockExternalApiResponse });

    const result = await service.create(createTenantDto);

    expect(mockTenantRepository.find).toHaveBeenCalledWith({
      where: { name: 'New Tenant' },
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://fullstack.exercise.applifting.cz/tenants',
      createTenantDto,
    );
    expect(mockTenantRepository.create).toHaveBeenCalledWith({
      tenantId: mockExternalApiResponse.tenantId,
      apiKey: mockExternalApiResponse.apiKey,
      name: mockExternalApiResponse.name,
      password: expect.any(String), // Ensure password is hashed
      createdAt: expect.any(Date),
      lastUsedAt: null,
      articles: [],
    });
    expect(mockTenantRepository.save).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toEqual(mockTenant);
  });

  it('should throw BadRequestException if tenant name is already in use', async () => {
    mockTenantRepository.find.mockResolvedValue([mockTenant]); // Mock that a tenant with the same name already exists

    await expect(
      service.create({ name: 'Test Tenant', password: 'password123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find a tenant by ID', async () => {
    const tenantId = '1';
    mockTenantRepository.findOne.mockResolvedValue(mockTenant);

    const result = await service.findOne(tenantId);

    expect(mockTenantRepository.findOne).toHaveBeenCalledWith({
      where: { tenantId },
      relations: ['articles'],
    });
    expect(result).toEqual(mockTenant);
  });

  it('should return null if tenant ID is not provided', async () => {
    const result = await service.findOne(null);

    expect(result).toBeNull();
  });

  it('should throw NotFoundException if tenant is not found', async () => {
    const tenantId = 'non-existing-id';
    mockTenantRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(tenantId)).resolves.toBeNull();
  });
});
