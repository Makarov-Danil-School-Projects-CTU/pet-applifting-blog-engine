import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';
import { ArticleResolver } from '../graphql/resolvers/article.resolver';
import { AccessTokenMiddleware } from '../middlewares/access-token.middleware';
import { ApiKeyMiddleware } from '../middlewares/api-key.middleware';
import { CurrentTenantMiddleware } from '../middlewares/current-tenant.middleware';
import { TenantService } from '../tenant/tenant.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tenant])],
  providers: [ArticleService, ArticleResolver, TenantService],
  controllers: [ArticleController],
})
export class ArticleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, AccessTokenMiddleware, CurrentTenantMiddleware)
      .forRoutes(ArticleController);
  }
}
