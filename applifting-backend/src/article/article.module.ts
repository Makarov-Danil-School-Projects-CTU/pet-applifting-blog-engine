import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from 'src/entities/article.entity';
import { ArticleResolver } from 'src/graphql/resolvers/article.resolver';
import { AccessTokenMiddleware } from 'src/middlewares/access-token.middleware';
import { ApiKeyMiddleware } from 'src/middlewares/api-key.middleware';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Tenant } from 'src/entities/tenant.entity';

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
