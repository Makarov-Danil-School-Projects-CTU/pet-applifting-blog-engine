import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { Comment } from '../entities/comment.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CommentService } from './comment.service';
import { CommentResponseDto } from './dtos/comment-response.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommentDto } from './dtos/create-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({
    type: CreateCommentDto,
    description: 'Data required to create a new comment',
  })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
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
  @ApiOperation({ summary: 'Find a comment by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the comment to find',
  })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully retrieved.',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async getCommentById(@Param('id') id: string): Promise<Comment> {
    return this.commentService.getCommentById(id);
  }

  // Delete a comment by ID
  @Delete(':id')  
  @Serialize(CommentResponseDto)
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the comment to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async deleteComment(@Param('id') id: string): Promise<Comment> {
    return await this.commentService.deleteComment(id);
  }
}
