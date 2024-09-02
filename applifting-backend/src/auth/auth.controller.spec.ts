import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockLoginUserDto = {
  username: 'testuser',
  password: 'password123',
};

const mockLoginResponseDto = {
  access_token: 'mock_access_token',
  expires_in: 3600,
  token_type: 'Bearer',
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue(mockLoginResponseDto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should authenticate user and return access token', async () => {
    const req = {
      headers: { 'x-api-key': 'test_api_key' },
    } as unknown as Request;

    const result = await controller.login(mockLoginUserDto, req);

    expect(service.login).toHaveBeenCalledWith(mockLoginUserDto, 'test_api_key');
    expect(result).toEqual(mockLoginResponseDto);
  });

  it('should throw UnauthorizedException if login fails', async () => {
    const req = {
      headers: { 'x-api-key': 'invalid_api_key' },
    } as unknown as Request;

    mockAuthService.login.mockRejectedValueOnce(
      new HttpException('Failed to log in', HttpStatus.UNAUTHORIZED)
    );

    await expect(controller.login(mockLoginUserDto, req)).rejects.toThrow(
      HttpException,
    );
  });
});
