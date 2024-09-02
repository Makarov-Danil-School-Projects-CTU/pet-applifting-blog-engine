import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

const mockComment = {
  commentId: '1',
  author: 'John Doe',
  content: 'This is a test comment',
  postedAt: new Date('2024-09-02T19:59:11.886Z'),
  score: 5,
  article: { articleId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa' }, // Assuming minimal setup
};

const mockPagination = {
  totalItems: 1,
  itemCount: 1,
  itemsPerPage: 10,
  totalPages: 1,
  currentPage: 1,
};

const mockCommentService = {
  getCommentsForArticle: jest.fn().mockResolvedValue({
    pagination: mockPagination,
    items: [mockComment],
  }),
  getCommentById: jest.fn((id: string) => {
    if (id === 'non-existing-id') {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return Promise.resolve(mockComment);
  }),
  deleteComment: jest.fn((id: string) => {
    if (id === 'non-existing-id') {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return Promise.resolve(mockComment);
  }),
};

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get comments for an article', async () => {
    const articleId = '99a0de2e-6efb-4f16-9604-812e2dd6e1aa';
    const page = 1;
    const limit = 10;

    const result = await controller.getCommentsForArticle(
      articleId,
      page,
      limit,
    );

    expect(service.getCommentsForArticle).toHaveBeenCalledWith(
      articleId,
      page,
      limit,
    );
    expect(result).toEqual({
      pagination: mockPagination,
      items: [mockComment],
    });
  });

  it('should throw an error if article ID is not provided when getting comments', async () => {
    await expect(controller.getCommentsForArticle('', 1, 10)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should get a comment by ID', async () => {
    const commentId = '1';

    const result = await controller.getCommentById(commentId);

    expect(service.getCommentById).toHaveBeenCalledWith(commentId);
    expect(result).toEqual(mockComment);
  });

  it('should throw an error if comment is not found', async () => {
    const commentId = 'non-existing-id';

    await expect(controller.getCommentById(commentId)).rejects.toThrow(
      NotFoundException,
    );
  });
  
  it('should delete a comment', async () => {
    const commentId = '1';

    const result = await controller.deleteComment(commentId);

    expect(service.deleteComment).toHaveBeenCalledWith(commentId);
    expect(result).toEqual(mockComment);
  });

  it('should throw an error if trying to delete a non-existing comment', async () => {
    const commentId = 'non-existing-id';

    await expect(controller.deleteComment(commentId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
