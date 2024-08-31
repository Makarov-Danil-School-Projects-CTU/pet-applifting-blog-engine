import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { LoginResponse } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { LoginInput } from '../inputs/login.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async login(
    @Args('input') input: LoginInput,
    @Context() context: any,
  ): Promise<LoginResponse> {
    const apiKey = context.req.headers['x-api-key'];
    console.log(input); 
    
    return this.authService.login(input, apiKey);
  }
}
