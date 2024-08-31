import { Body, Controller, Headers, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginUserDto,
    @Headers('X-API-KEY') apiKey: string,
  ): Promise<LoginResponse> {
    return this.authService.login(body, apiKey);
  }
}
