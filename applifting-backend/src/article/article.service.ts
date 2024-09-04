import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto, tenantId: string): Promise<Article> {
    const tenant = await this.tenantRepository.findOne({ where: { tenantId } });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      tenant,
      comments: [],
    });

    return await this.articleRepository.save(article);
  }

  async getAllArticles(tenantId: string): Promise<Article[]> {
    return await this.articleRepository.find({
      where: { tenant: { tenantId } },
      relations: ['tenant', 'comments', 'comments.article', 'image'],
    });
  }

  async getArticleById(articleId: string, tenantId: string): Promise<Article> {
    return await this.articleRepository.findOne({
      where: { articleId, tenant: { tenantId } },
      relations: ['tenant', 'comments', 'comments.article', 'image'],
    });
  }

  async updateArticle(
    articleId: string,
    updateArticleDto: UpdateArticleDto,
    tenantId: string,
  ): Promise<Article> {
    await this.articleRepository.update({ articleId }, updateArticleDto);
    return this.getArticleById(articleId, tenantId);
  }

  async deleteArticle(articleId: string, tenantId: string): Promise<Article> {
    const article = await this.getArticleById(articleId, tenantId);
    if (!article) {
      throw new NotFoundException('Article was not found');
    }

    await this.articleRepository.delete({ articleId });
    return article;
  }
}
