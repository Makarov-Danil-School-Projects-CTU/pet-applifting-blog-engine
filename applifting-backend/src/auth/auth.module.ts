import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ApiKeyMiddleware } from '..//middlewares/api-key.middleware';
import { AuthResolver } from '../graphql/resolvers/auth.resolver';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(AuthController);
  }
}
