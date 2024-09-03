import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from '../entities/article.entity';
import { ArticleResolver } from '../graphql/resolvers/article.resolver';
import { AccessTokenMiddleware } from '../middlewares/access-token.middleware';
import { ApiKeyMiddleware } from '../middlewares/api-key.middleware';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Tenant } from '../entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tenant])],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleResolver],
})
export class ArticleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, AccessTokenMiddleware)
      .forRoutes(ArticleController);
  }
}
