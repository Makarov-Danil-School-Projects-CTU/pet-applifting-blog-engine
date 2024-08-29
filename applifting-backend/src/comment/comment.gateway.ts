import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { Server, Socket } from 'socket.io';

import { Comment } from '../entities/comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { VoteDto } from './dtos/vote.dto';

@WebSocketGateway(3001, {
  cors: {
    origin: '*', // Allow all origins, change this in production
  },
})
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commentService: CommentService) {}

  @SubscribeMessage('addComment')
  async handleAddComment(client: Socket, payload: string): Promise<Comment> {
    const createCommentDto = plainToInstance(
      CreateCommentDto,
      JSON.parse(payload),
    );
    const newComment =
      await this.commentService.createComment(createCommentDto);
    this.server.emit('commentAdded', newComment);

    return newComment;
  }

  @SubscribeMessage('voteComment')
  async handleVoteComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): Promise<Comment> {
    const voteDto = plainToInstance(VoteDto, JSON.parse(payload));
    const ipAddress = client.handshake.address; // Get client IP address
    const updatedComment = await this.commentService.voteOnComment(
      voteDto,
      ipAddress,
    );
    this.server.emit('commentVoted', updatedComment);

    return updatedComment;
  }
}
