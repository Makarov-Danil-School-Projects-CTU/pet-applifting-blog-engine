import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { Article } from 'src/entities/article.entity';
import { CommentVote } from 'src/entities/comment-vote.entity';
import { Comment } from 'src/entities/comment.entity';
import { CommentResponseDto } from './dtos/comment-response.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { VoteDto } from './dtos/vote.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentVote)
    private readonly commentVoteRepository: Repository<CommentVote>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { articleId, author, content } = createCommentDto;
    const article = await this.articleRepository.findOne({
      where: { articleId },
    });

    if (!article) {
      throw new NotFoundException(
        `Article with ID ${createCommentDto.articleId} not found`,
      );
    }

    const comment = this.commentRepository.create({
      author,
      content,
      article,
    });

    return this.commentRepository.save(comment);
  }

  async voteOnComment(voteDto: VoteDto, ipAddress: string): Promise<Comment> {
    const { commentId } = voteDto;
    const comment = await this.commentRepository.findOne({
      where: { commentId },
    });

    if (!comment) {
      throw new NotFoundException(
        `Comment with ID ${voteDto.commentId} not found`,
      );
    }

    const existingVote = await this.commentVoteRepository.findOne({
      where: {
        comment: { commentId },
        ipAddress,
      },
    });
    const voteValue = voteDto.vote === 'up' ? 1 : -1;

    if (existingVote) {
      // If the vote value is different, update it
      if (existingVote.value !== voteValue) {
        existingVote.value = voteValue;

        await this.commentVoteRepository.save(existingVote);
        comment.score += voteValue;
        await this.commentRepository.save(comment);
      }
      // If the vote is the same, do nothing or handle as per your requirements
    } else {
      // If there is no existing vote, create a new vote
      const vote = this.commentVoteRepository.create({
        ipAddress,
        value: voteDto.vote === 'up' ? 1 : -1,
        comment,
      });

      await this.commentVoteRepository.save(vote);

      // Update comment score
      comment.score += vote.value;
      await this.commentRepository.save(comment);
    }

    return comment;
  }

  async getCommentsForArticle(
    articleId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ pagination: any; items: CommentResponseDto[] }> {
    const [items, total] = await this.commentRepository.findAndCount({
      where: { article: { articleId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { postedAt: 'DESC' },
      relations: ['article'],
    });

    const pagination = {
      offset: (page - 1) * limit,
      limit: limit,
      total: total,
    };

    const commentResponseDto = plainToInstance(CommentResponseDto, items, {
      excludeExtraneousValues: true,
    });

    return { pagination, items: commentResponseDto };
  }

  async getCommentById(commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { commentId },
      relations: ['article'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    return comment;
  }

  async deleteComment(commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { commentId },
      relations: ['article'],
    });

    if (!comment) {
      throw new NotFoundException('Comment was not found');
    }

    await this.commentRepository.delete(commentId);
    return comment;
  }
}
