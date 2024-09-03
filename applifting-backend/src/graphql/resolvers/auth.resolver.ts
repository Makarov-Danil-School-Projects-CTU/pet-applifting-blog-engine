import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from '../../auth/auth.service';
import { LoginInput } from '../inputs/login.input';
import { LoginResponseDto } from '../../auth/dtos/login-response.dto';
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../guards/api-key.guard';

@Resolver('Auth')
@UseGuards(ApiKeyGuard)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async login(
    @Args('input') input: LoginInput,
    @Context() context: any,
  ): Promise<LoginResponseDto> {
    const apiKey = context.req.headers['x-api-key'];

    return this.authService.login(input, apiKey);
  }
}
