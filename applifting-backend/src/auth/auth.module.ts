import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ApiKeyMiddleware } from 'src/middlewares/api-key.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from 'src/graphql/resolvers/auth.resolver';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(AuthController);
  }
}
