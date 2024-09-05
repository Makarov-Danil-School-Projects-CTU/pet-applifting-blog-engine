import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
import { CommentVote } from '../entities/comment-vote.entity';
import { Comment } from '../entities/comment.entity';
import { Tenant } from '../entities/tenant.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { VoteDto } from './dtos/vote.dto';

const mockComment = {
  commentId: '1',
  author: 'John Doe',
  content: 'This is a test comment',
  postedAt: new Date('2024-09-02T19:59:11.886Z'),
  score: 0,
  article: { articleId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa' },
  votes: [],
  tenant: { tenantId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa' },
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

const mockTenant = {
  tenantId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
  apiKey: 'test-api-key',
  name: 'Test Tenant',
  password: 'test-password',
  createdAt: new Date(),
  lastUsedAt: new Date(),
  articles: [],
  comments: [],
  commentVotes: [],
  image: null,
} as Tenant;

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
  findOne: jest.fn((options) => {
    if (options.where.articleId === 'non-existing-article-id') {
      return Promise.resolve(null);
    }
    return Promise.resolve(mockArticle);
  }),
};

const mockTenantRepository = {
  findOne: jest.fn().mockResolvedValue(mockTenant),
};

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<Comment>;
  let commentVoteRepository: Repository<CommentVote>;
  let articleRepository: Repository<Article>;
  let tenantRepository: Repository<Tenant>;

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
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
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
    articleRepository = module.get<Repository<Article>>(
      getRepositoryToken(Article),
    );
    tenantRepository = module.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a comment', async () => {
    const createCommentDto = {
      articleId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
      author: 'John Doe',
      content: 'This is a test comment',
    } as CreateCommentDto;

    const result = await service.createComment(
      createCommentDto,
      mockTenant.tenantId,
    );

    expect(articleRepository.findOne).toHaveBeenCalledWith({
      where: {
        articleId: createCommentDto.articleId,
        tenant: { tenantId: mockTenant.tenantId },
      },
      relations: ['tenant'],
    });
    expect(commentRepository.create).toHaveBeenCalledWith({
      author: createCommentDto.author,
      content: createCommentDto.content,
      article: mockArticle,
      votes: [],
      tenant: mockTenant,
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

    await expect(
      service.createComment(createCommentDto, mockTenant.tenantId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should vote on a comment', async () => {
    const voteDto: VoteDto = {
      commentId: '9fc3e31f-ccf1-4748-8e0e-53a3251fa9c6',
      vote: 'UP',
    };

    const result = await service.voteOnComment(
      voteDto,
      '127.0.0.1',
      mockTenant.tenantId,
    );

    expect(commentRepository.findOne).toHaveBeenCalledWith({
      where: {
        commentId: voteDto.commentId,
        tenant: { tenantId: mockTenant.tenantId },
      },
      relations: ['tenant'],
    });
    expect(commentVoteRepository.findOne).toHaveBeenCalledWith({
      where: {
        comment: { commentId: voteDto.commentId },
        ipAddress: '127.0.0.1',
        tenant: { tenantId: mockTenant.tenantId },
      },
      relations: ['comment', 'tenant'],
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

    await expect(
      service.voteOnComment(voteDto, '127.0.0.1', mockTenant.tenantId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should get comments for an article', async () => {
    const articleId = '99a0de2e-6efb-4f16-9604-812e2dd6e1aa';
    const page = 1;
    const limit = 10;

    const result = await service.getCommentsForArticle(
      articleId,
      page,
      limit,
      mockTenant.tenantId,
    );

    expect(commentRepository.findAndCount).toHaveBeenCalledWith({
      where: {
        article: { articleId },
        tenant: { tenantId: mockTenant.tenantId }, // Add the tenant check here
      },
      skip: 0,
      take: limit,
      order: { postedAt: 'DESC' },
      relations: ['article', 'tenant'],
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

    await expect(
      service.getCommentById(commentId, mockTenant.tenantId),
    ).rejects.toThrow(NotFoundException);
  });
});
