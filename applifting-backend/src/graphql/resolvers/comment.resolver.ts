import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { CommentService } from '../../comment/comment.service';
import { Comment } from '../../entities/comment.entity';
import { AccessTokenGuardWebsockets } from '../../guards/access-token-websockets.guard';
import { ApiKeyGuardWebsockets } from '../../guards/api-key-websockets.guard';
import { CreateCommentInput } from '../inputs/create-comment.input';
import { VoteCommentInput } from '../inputs/vote-comment.input';

const pubSub = new PubSub(); // GraphQL PubSub instance

@Resolver(() => Comment)
// This is a custom guard for handling GraphQL requests
// For websockets req is different. Because of that we have 2 versions for HTTP and WebSockets
@UseGuards(AccessTokenGuardWebsockets)
@UseGuards(ApiKeyGuardWebsockets)
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
