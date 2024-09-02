import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
import { CommentVote } from '../entities/comment-vote.entity';
import { Comment } from '../entities/comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { NotFoundException } from '@nestjs/common';
import { VoteDto } from './dtos/vote.dto';

const mockComment = {
  commentId: '1',
  author: 'John Doe',
  content: 'This is a test comment',
  postedAt: new Date('2024-09-02T19:59:11.886Z'),
  score: 0,
  article: { articleId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa' },
  votes: [],
};

const mockArticle = {
  articleId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
  title: 'Test Article',
};

const mockCommentVote = {
  voteId: '1',
  comment: mockComment,
  ipAddress: '127.0.0.1',
  value: 1,
};

const mockCommentRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockResolvedValue(mockComment),
  findOne: jest.fn((id: string) => {
    if (id === 'non-existing-id') {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return Promise.resolve(mockComment);
  }),
  findAndCount: jest.fn().mockResolvedValue([[mockComment], 1]),
  delete: jest.fn().mockResolvedValue(undefined),
};

const mockCommentVoteRepository = {
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockResolvedValue(mockCommentVote),
};

const mockArticleRepository = {
  findOne: jest.fn().mockResolvedValue(mockArticle),
};

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<Comment>;
  let commentVoteRepository: Repository<CommentVote>;
  let articleRepository: Repository<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(CommentVote),
          useValue: mockCommentVoteRepository,
        },
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    commentVoteRepository = module.get<Repository<CommentVote>>(
      getRepositoryToken(CommentVote),
    );
    articleRepository = module.get<Repository<Article>>(
      getRepositoryToken(Article),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a comment', async () => {
    const createCommentDto: CreateCommentDto = {
      articleId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
      author: 'John Doe',
      content: 'This is a test comment',
    };

    const result = await service.createComment(createCommentDto);

    expect(articleRepository.findOne).toHaveBeenCalledWith({
      where: { articleId: createCommentDto.articleId },
    });
    expect(commentRepository.create).toHaveBeenCalledWith({
      author: createCommentDto.author,
      content: createCommentDto.content,
      article: mockArticle,
      votes: [],
    });
    expect(commentRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockComment);
  });

  it('should throw NotFoundException if the article is not found when creating a comment', async () => {
    mockArticleRepository.findOne = jest.fn().mockResolvedValue(null);

    const createCommentDto: CreateCommentDto = {
      articleId: 'non-existing-article-id',
      author: 'John Doe',
      content: 'This is a test comment',
    };

    await expect(service.createComment(createCommentDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should vote on a comment', async () => {
    const voteDto: VoteDto = {
      commentId: '1',
      vote: 'UP',
    };

    const result = await service.voteOnComment(voteDto, '127.0.0.1');

    expect(commentRepository.findOne).toHaveBeenCalledWith({
      where: { commentId: voteDto.commentId },
    });
    expect(commentVoteRepository.findOne).toHaveBeenCalledWith({
      where: {
        comment: { commentId: voteDto.commentId },
        ipAddress: '127.0.0.1',
      },
    });
    expect(commentVoteRepository.create).toHaveBeenCalledWith({
      ipAddress: '127.0.0.1',
      value: 1,
      comment: mockComment,
    });
    expect(commentVoteRepository.save).toHaveBeenCalled();
    expect(commentRepository.save).toHaveBeenCalledWith({
      ...mockComment,
      score: 1,
    });
    expect(result).toEqual(mockComment);
  });

  it('should throw NotFoundException if the comment is not found when voting', async () => {
    mockCommentRepository.findOne = jest.fn().mockResolvedValue(null);

    const voteDto: VoteDto = {
      commentId: 'non-existing-comment-id',
      vote: 'UP',
    };

    await expect(service.voteOnComment(voteDto, '127.0.0.1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should get comments for an article', async () => {
    const articleId = '99a0de2e-6efb-4f16-9604-812e2dd6e1aa';
    const page = 1;
    const limit = 10;

    const result = await service.getCommentsForArticle(articleId, page, limit);

    expect(commentRepository.findAndCount).toHaveBeenCalledWith({
      where: { article: { articleId } },
      skip: 0,
      take: limit,
      order: { postedAt: 'DESC' },
      relations: ['article'],
    });

    expect(result).toEqual({
      pagination: {
        offset: 0,
        limit: 10,
        total: 1,
      },
      items: [
        expect.objectContaining({
          commentId: '1',
          articleId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
          author: 'John Doe',
          content: 'This is a test comment',
          postedAt: new Date('2024-09-02T19:59:11.886Z'),
          score: 1,
        }),
      ],
    });
  });

  it('should throw NotFoundException if comment is not found by ID', async () => {
    const commentId = 'non-existing-id';

    await expect(service.getCommentById(commentId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
