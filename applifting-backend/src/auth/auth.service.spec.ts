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

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login and return access token', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: mockLoginResponseDto,
    });

    const result = await service.login(mockLoginUserDto, 'test_api_key');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://fullstack.exercise.applifting.cz/login',
      { username: 'testuser', password: 'password123' },
      { headers: { 'X-API-KEY': 'test_api_key' } },
    );

    expect(result).toEqual(mockLoginResponseDto);
  });

  it('should throw HttpException if login fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Unauthorized'));

    await expect(
      service.login(mockLoginUserDto, 'invalid_api_key')
    ).rejects.toThrow(HttpException);
  });
});