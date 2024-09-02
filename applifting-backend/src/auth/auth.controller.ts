import { Body, Controller, Headers, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dtos/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return access token' })
  @ApiBody({ type: LoginUserDto, description: 'User login credentials' })
  @ApiResponse({
    status: 200,
    description: 'Successful login response with an access token',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiSecurity('ApiKeyAuth')
  async login(
    @Body() body: LoginUserDto,
    // @Headers('X-API-KEY') apiKey: string
    @Req() req: Request
  ): Promise<LoginResponseDto> {
    console.log(body)
    const apiKey = req.headers['x-api-key'] as string;
    return this.authService.login(body, apiKey);
  }
}
