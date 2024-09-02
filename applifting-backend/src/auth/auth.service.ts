import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

import { setToken } from '../token-store';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

@Injectable()
export class AuthService {
  private readonly loginApiUrl =
    'https://fullstack.exercise.applifting.cz/login';

  async login(
    loginUserDto: LoginUserDto,
    apiKey: string,
  ): Promise<LoginResponseDto> {
    const { username, password } = loginUserDto;

    try {
      const response = await axios.post<LoginResponseDto>(
        this.loginApiUrl,
        { username, password },
        {
          headers: {
            'X-API-KEY': apiKey,
          },
        },
      );

      const { access_token, expires_in } = response.data;

      setToken(access_token, expires_in);

      return response.data;
    } catch (error) {
      throw new HttpException('Failed to log in', HttpStatus.UNAUTHORIZED);
    }
  }
}
