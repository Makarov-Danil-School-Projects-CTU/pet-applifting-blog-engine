import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginUserDto } from './dtos/login-user.dto';

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
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    const apiKey = req.headers['x-api-key'] as string;
    return this.authService.login(body, apiKey);
  }
}
