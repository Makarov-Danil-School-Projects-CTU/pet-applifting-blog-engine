import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from 'src/entities/article.entity';
import { CommentVote } from 'src/entities/comment-vote.entity';
import { Comment } from 'src/entities/comment.entity';
import { AccessTokenMiddleware } from 'src/middlewares/access-token.middleware';
import { ApiKeyMiddleware } from 'src/middlewares/api-key.middleware';
import { CommentController } from './comment.controller';
import { CommentsGateway } from './comment.gateway';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentVote, Article])],
  providers: [CommentService, CommentsGateway],
  controllers: [CommentController],
})
export class CommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, AccessTokenMiddleware)
      .forRoutes(CommentController);
  }
}
