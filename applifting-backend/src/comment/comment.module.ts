import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from '../entities/article.entity';
import { CommentVote } from '../entities/comment-vote.entity';
import { Comment } from '../entities/comment.entity';
import { AccessTokenMiddleware } from '../middlewares/access-token.middleware';
import { ApiKeyMiddleware } from '../middlewares/api-key.middleware';
import { CommentController } from './comment.controller';
// import { CommentsGateway } from './comment.gateway';
import { CurrentTenantMiddleware } from '../middlewares/current-tenant.middleware';
import { TenantService } from '../tenant/tenant.service';
import { Tenant } from '../entities/tenant.entity';
import { CommentResolver } from '../graphql/resolvers/comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentVote, Article, Tenant])],
  providers: [
    CommentService,
    // CommentsGateway,
    CommentResolver,
    TenantService,
  ],
  controllers: [CommentController],
})
export class CommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, AccessTokenMiddleware, CurrentTenantMiddleware)
      .forRoutes(CommentController);
  }
}
