import { Test, TestingModule } from '@nestjs/testing';

import { Article } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

const mockTenant: Tenant = {
  tenantId: 'mock-tenant-id',
  apiKey: 'mock-api-key',
  name: 'Mock Tenant',
  password: '123123123',
  createdAt: new Date(),
  lastUsedAt: null,
  articles: [],
  image: null,
  comments: [],
  commentVotes: [],
};

// Mock Data and Setup
const articles: Article[] = [
  {
    articleId: '1',
    title: 'Test Article 1',
    perex: 'Summary of article 1',
    content: 'Content of article 1',
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    tenant: null, // Assuming a minimal setup where tenant is not needed
    comments: [],
    image: null,
  },
  {
    articleId: '2',
    title: 'Test Article 2',
    perex: 'Summary of article 2',
    content: 'Content of article 2',
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    tenant: null,
    comments: [],
    image: null,
  },
];

describe('ArticleController', () => {
  let controller: ArticleController;
  let fakeArticleService: Partial<ArticleService>;

  beforeEach(async () => {
    fakeArticleService = {
      createArticle: jest.fn((dto: CreateArticleDto, tenantId: string) => {
        const newArticle = {
          ...dto,
          articleId: (articles.length + 1).toString(),
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
          tenant: null,
          comments: [],
          image: null,
        } as Article;
        articles.push(newArticle);
        return Promise.resolve(newArticle);
      }),
      getArticleById: jest.fn((id: string, tenantId: string) => {
        const article = articles.find((article) => article.articleId === id);
        return Promise.resolve(article);
      }),
      getAllArticles: jest.fn((tenantId: string) => {
        return Promise.resolve(articles);
      }),
      updateArticle: jest.fn(
        (id: string, dto: UpdateArticleDto, tenantId: string) => {
          const articleIndex = articles.findIndex(
            (article) => article.articleId === id,
          );
          if (articleIndex === -1) return Promise.resolve(null);
          const updatedArticle = {
            ...articles[articleIndex],
            ...dto,
            lastUpdatedAt: new Date(),
          };
          articles[articleIndex] = updatedArticle;
          return Promise.resolve(updatedArticle);
        },
      ),
      deleteArticle: jest.fn((id: string, tenantId: string) => {
        const articleIndex = articles.findIndex(
          (article) => article.articleId === id,
        );
        if (articleIndex === -1) return Promise.resolve(null);
        const deletedArticle = articles.splice(articleIndex, 1)[0];
        return Promise.resolve(deletedArticle);
      }),
    };
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: fakeArticleService,
        },
      ],
    }).compile();

    controller = moduleRef.get<ArticleController>(ArticleController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new article', async () => {
    const createArticleDto: CreateArticleDto = {
      title: 'New Article',
      perex: 'Summary of new article',
      content: 'Content of new article',
    };

    const result = await controller.createArticle(createArticleDto, mockTenant);

    expect(result).toHaveProperty('articleId');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('perex');
    expect(result).toHaveProperty('content');
    expect(result.title).toEqual(createArticleDto.title);
    expect(result.perex).toEqual(createArticleDto.perex);
    expect(result.content).toEqual(createArticleDto.content);
    expect(fakeArticleService.createArticle).toHaveBeenCalledWith(
      createArticleDto,
      mockTenant.tenantId,
    );
  });

  it('should get an article by ID', async () => {
    const articleId = '1';
    const result = await controller.getArticleById(articleId, mockTenant);

    expect(result).toEqual(articles[0]);
    expect(fakeArticleService.getArticleById).toHaveBeenCalledWith(
      articleId,
      mockTenant.tenantId,
    );
  });

  it('should return null if no article is found by ID', async () => {
    const articleId = 'non-existing-id';
    const result = await controller.getArticleById(articleId, mockTenant);

    expect(result).toBeUndefined();
    expect(fakeArticleService.getArticleById).toHaveBeenCalledWith(
      articleId,
      mockTenant.tenantId,
    );
  });

  it('should return all articles', async () => {
    const result = await controller.getAllArticles(mockTenant);

    expect(result).toEqual(articles);
    expect(fakeArticleService.getAllArticles).toHaveBeenCalled();
  });

  it('should update an existing article', async () => {
    const updateArticleDto: UpdateArticleDto = {
      title: 'Updated Article Title',
      content: 'Updated content of the article',
    };

    const articleId = '1';
    const updatedArticle = {
      ...articles[0],
      ...updateArticleDto,
      lastUpdatedAt: new Date(),
    };

    fakeArticleService.updateArticle = jest
      .fn()
      .mockResolvedValue(updatedArticle);
    const result = await controller.updateArticle(
      articleId,
      updateArticleDto,
      mockTenant,
    );

    expect(result).toEqual(updatedArticle);
    expect(fakeArticleService.updateArticle).toHaveBeenCalledWith(
      articleId,
      updateArticleDto,
      mockTenant.tenantId,
    );
  });

  it('should return null if trying to update a non-existing article', async () => {
    const updateArticleDto: UpdateArticleDto = {
      title: 'Updated Article Title',
      content: 'Updated content of the article',
    };

    const articleId = 'non-existing-id';

    fakeArticleService.updateArticle = jest.fn().mockResolvedValue(null);
    const result = await controller.updateArticle(
      articleId,
      updateArticleDto,
      mockTenant,
    );

    expect(result).toBeNull();
    expect(fakeArticleService.updateArticle).toHaveBeenCalledWith(
      articleId,
      updateArticleDto,
      mockTenant.tenantId,
    );
  });

  it('should delete an article', async () => {
    const articleId = '1';
    const deletedArticle = articles[0];

    fakeArticleService.deleteArticle = jest
      .fn()
      .mockResolvedValue(deletedArticle);
    const result = await controller.deleteArticle(articleId, mockTenant);

    expect(result).toEqual(deletedArticle);
    expect(fakeArticleService.deleteArticle).toHaveBeenCalledWith(
      articleId,
      mockTenant.tenantId,
    );
  });

  it('should return null if trying to delete a non-existing article', async () => {
    const articleId = 'non-existing-id';

    fakeArticleService.deleteArticle = jest.fn().mockResolvedValue(null);
    const result = await controller.deleteArticle(articleId, mockTenant);

    expect(result).toBeNull();
    expect(fakeArticleService.deleteArticle).toHaveBeenCalledWith(
      articleId,
      mockTenant.tenantId,
    );
  });
});
