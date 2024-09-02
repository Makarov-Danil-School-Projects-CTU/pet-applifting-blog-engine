import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';
import { ArticleService } from './article.service';

const mockTenant = {
  tenantId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
  name: 'Test Tenant',
  apiKey: 'test-api-key',
  createdAt: new Date(),
  lastUsedAt: new Date(),
};

const mockArticle = {
  articleId: 'e8d5f237-b99d-481f-a7a2-727550c7c6b4',
  title: 'Lorem Ipsum',
  perex:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  content:
    '# Lorem Ipsum\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.',
  createdAt: new Date(),
  lastUpdatedAt: new Date(),
  tenant: mockTenant,
  comments: [],
};

const fakeArticleRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockResolvedValue(mockArticle),
  find: jest.fn().mockResolvedValue([mockArticle]),
  findOne: jest.fn().mockResolvedValue(mockArticle),
  update: jest.fn().mockResolvedValue(mockArticle),
  delete: jest.fn().mockResolvedValue(mockArticle),
};

const fakeTenantRepository = {
  findOne: jest.fn().mockResolvedValue(mockTenant),
};

describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepository: Repository<Article>;
  let tenantRepository: Repository<Tenant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: fakeArticleRepository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: fakeTenantRepository,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
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

  it('should create an article', async () => {
    const createArticleDto = {
      title: 'Lorem Ipsum',
      perex:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      content:
        '# Lorem Ipsum\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.',
      tenantId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa',
    };

    const result = await service.createArticle(createArticleDto);

    expect(articleRepository.create).toHaveBeenCalledWith({
      title: createArticleDto.title,
      perex: createArticleDto.perex,
      content: createArticleDto.content,
      tenant: mockTenant, // Here, the tenant is already fetched and set
      comments: [],
    });
    expect(result).toEqual(mockArticle);
    expect(result.title).toEqual(createArticleDto.title);
    expect(result.perex).toEqual(createArticleDto.perex);
    expect(result.content).toEqual(createArticleDto.content);
    expect(result.tenant.tenantId).toEqual(createArticleDto.tenantId);
  });
  
  it('should return all articles', async () => {
    const result = await service.getAllArticles();
    
    expect(articleRepository.find).toHaveBeenCalledWith({
      relations: ['tenant', 'comments'],
    });
    expect(result).toEqual([mockArticle]);
  });

  it('should get an article by ID', async () => {
    const articleId = 'e8d5f237-b99d-481f-a7a2-727550c7c6b4';
    const result = await service.getArticleById(articleId);
    
    expect(articleRepository.findOne).toHaveBeenCalledWith({
      where: { articleId },
      relations: ['tenant', 'comments'],
    });
    expect(result).toEqual(mockArticle);
  });

  it('should update an article', async () => {
    const updateArticleDto = { title: 'Updated Title' };
    const articleId = 'e8d5f237-b99d-481f-a7a2-727550c7c6b4';
  
    const result = await service.updateArticle(articleId, updateArticleDto);
    
    expect(articleRepository.update).toHaveBeenCalledWith({ articleId }, updateArticleDto);
    expect(articleRepository.findOne).toHaveBeenCalledWith({
      where: { articleId },
      relations: ['tenant', 'comments'],
    });
    expect(result).toEqual(mockArticle);
  });

  it('should delete an article', async () => {
    const articleId = 'e8d5f237-b99d-481f-a7a2-727550c7c6b4';
  
    const result = await service.deleteArticle(articleId);
    
    expect(articleRepository.findOne).toHaveBeenCalledWith({
      where: { articleId },
      relations: ['tenant', 'comments'],
    });
    expect(articleRepository.delete).toHaveBeenCalledWith({ articleId });
    expect(result).toEqual(mockArticle);
  });
});

