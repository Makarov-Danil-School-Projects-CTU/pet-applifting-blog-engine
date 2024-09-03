import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from '../entities/article.entity';
import { CommentVote } from '../entities/comment-vote.entity';
import { Comment } from '../entities/comment.entity';
import { AccessTokenMiddleware } from '../middlewares/access-token.middleware';
import { ApiKeyMiddleware } from '../middlewares/api-key.middleware';
import { CommentController } from './comment.controller';
// import { CommentsGateway } from './comment.gateway';
import { CommentService } from './comment.service';
import { CommentResolver } from '../graphql/resolvers/comment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentVote, Article])],
  providers: [CommentService, 
    // CommentsGateway,
     CommentResolver],
  controllers: [CommentController],
})
export class CommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, AccessTokenMiddleware)
      .forRoutes(CommentController);
  }
}
