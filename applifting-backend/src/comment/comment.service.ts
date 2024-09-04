import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
import { CommentVote } from '../entities/comment-vote.entity';
import { Comment } from '../entities/comment.entity';
import { Tenant } from '../entities/tenant.entity';
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

    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    tenantId: string,
  ): Promise<Comment> {
    const { articleId, author, content } = createCommentDto;
    const article = await this.articleRepository.findOne({
      where: { articleId, tenant: { tenantId } },
      relations: ['tenant'],
    });

    if (!article) {
      throw new NotFoundException(
        `Article with ID ${createCommentDto.articleId} not found`,
      );
    }

    const tenant = await this.tenantRepository.findOne({ where: { tenantId } });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const comment = this.commentRepository.create({
      author,
      content,
      article,
      votes: [],
      tenant
    });

    return this.commentRepository.save(comment);
  }

  async voteOnComment(
    voteDto: VoteDto,
    ipAddress: string,
    tenantId: string,
  ): Promise<Comment> {
    const { commentId } = voteDto;
    const comment = await this.commentRepository.findOne({
      where: { commentId, tenant: { tenantId } },
      relations: ['tenant'],
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
        tenant: { tenantId },
      },
      relations: ['comment', 'tenant'],
    });
    const voteValue = voteDto.vote === 'UP' ? 1 : -1;

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
      // TO-DO add tenant
      const tenant = await this.tenantRepository.findOne({ where: { tenantId } });

      if (!tenant) {
        throw new Error('Tenant not found');
      }

      const vote = this.commentVoteRepository.create({
        ipAddress,
        value: voteDto.vote === 'UP' ? 1 : -1,
        comment,
        tenant
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
    tenantId: string,
  ): Promise<{ pagination: any; items: CommentResponseDto[] }> {
    const [items, total] = await this.commentRepository.findAndCount({
      where: { article: { articleId }, tenant: { tenantId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { postedAt: 'DESC' },
      relations: ['article', 'tenant'],
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

  async getCommentById(commentId: string, tenantId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { commentId, tenant: { tenantId } },
      relations: ['article', 'tenant'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return comment;
  }

  async deleteComment(commentId: string, tenantId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { commentId, tenant: { tenantId } },
      relations: ['article', 'tenant'],
    });

    if (!comment) {
      throw new NotFoundException('Comment was not found');
    }

    await this.commentRepository.delete(commentId);
    return comment;
  }
}
