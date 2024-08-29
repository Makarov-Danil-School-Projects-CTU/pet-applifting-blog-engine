import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

import { setToken } from 'src/token-store';
import { LoginResponse } from './auth.controller';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  private readonly loginApiUrl =
    'https://fullstack.exercise.applifting.cz/login';

  async login(
    loginUserDto: LoginUserDto,
    apiKey: string,
  ): Promise<LoginResponse> {
    const { username, password } = loginUserDto;

    try {
      const response = await axios.post<LoginResponse>(
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
