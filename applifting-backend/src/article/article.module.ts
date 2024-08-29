import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from 'src/entities/article.entity';
import { AccessTokenMiddleware } from 'src/middlewares/access-token.middleware';
import { ApiKeyMiddleware } from 'src/middlewares/api-key.middleware';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, AccessTokenMiddleware)
      .forRoutes(ArticleController);
  }
}
