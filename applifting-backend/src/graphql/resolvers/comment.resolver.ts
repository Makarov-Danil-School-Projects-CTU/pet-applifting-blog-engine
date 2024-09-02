import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { CommentService } from 'src/comment/comment.service';
import { Comment } from 'src/entities/comment.entity';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { CreateCommentInput } from '../inputs/create-comment.input';
import { VoteCommentInput } from '../inputs/vote-comment.input';

const pubSub = new PubSub(); // GraphQL PubSub instance

@Resolver(() => Comment)
@UseGuards(AccessTokenGuard)
@UseGuards(ApiKeyGuard)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  // here is createComment mutation and following subscription
  @Mutation(() => Comment)
  async createComment(
    @Args('input') input: CreateCommentInput,
  ): Promise<Comment> {
    const newComment = await this.commentService.createComment(input);

    // Publish to GraphQL subscription after creating a comment
    pubSub.publish('commentAdded', { commentAdded: newComment });

    return newComment;
  }

  @Subscription(() => Comment, {
    filter: (payload, variables) => {
      return payload.commentAdded.article.articleId === variables.articleId;
    },
    resolve: (payload) => payload.commentAdded,
  })
  commentAdded(@Args('articleId') articleId: string) {
    return pubSub.asyncIterator('commentAdded');
  }

  // here is voteComment mutation and following subscription
  @Mutation(() => Comment)
  async voteComment(
    @Args('input') input: VoteCommentInput,
    @Context() context: any,
  ): Promise<Comment> {
    const ipAddress = context.req.ip;
    const updatedComment = await this.commentService.voteOnComment(
      input,
      ipAddress,
    );

    // Publish to GraphQL subscription after voting on a comment
    pubSub.publish('commentVoted', { commentVoted: updatedComment });

    return updatedComment;
  }

  @Subscription(() => Comment, {
    filter: (payload, variables) =>
      payload.commentVoted.commentId === variables.commentId,
    resolve: (payload) => payload.commentVoted,
  })
  commentVoted(@Args('commentId') commentId: string) {
    return pubSub.asyncIterator('commentVoted');
  }
}
