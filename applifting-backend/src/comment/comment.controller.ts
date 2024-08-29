import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { Comment } from 'src/entities/comment.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CommentService } from './comment.service';
import { CommentResponseDto } from './dtos/comment-response.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getCommentsForArticle(
    @Query('articleId') articleId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ pagination: any; items: CommentResponseDto[] }> {
    if (!articleId) {
      throw new NotFoundException('Article ID must be provided');
    }

    return this.commentService.getCommentsForArticle(articleId, page, limit);
  }

  // Get a single comment by ID
  @Get(':id')
  @Serialize(CommentResponseDto)
  async getCommentById(@Param('id') id: string): Promise<Comment> {
    return this.commentService.getCommentById(id);
  }

  // Delete a comment by ID
  @Delete(':id')
  @Serialize(CommentResponseDto)
  async deleteComment(@Param('id') id: string): Promise<Comment> {
    return await this.commentService.deleteComment(id);
  }
}
