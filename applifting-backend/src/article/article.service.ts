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

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const { tenantId, ...articleData } = createArticleDto;
    const tenant = await this.tenantRepository.findOne({ where: { tenantId } });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const article = this.articleRepository.create({
      ...articleData,
      tenant,
      comments: [],
    });

    return await this.articleRepository.save(article);
  }

  async getAllArticles(): Promise<Article[]> {
    return await this.articleRepository.find({
      relations: ['tenant', 'comments', 'comments.article', 'image'],
    });
  }

  async getArticleById(articleId: string): Promise<Article> {
    return await this.articleRepository.findOne({
      where: { articleId },
      relations: ['tenant', 'comments', 'comments.article', 'image'],
    });
  }

  async updateArticle(
    articleId: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    await this.articleRepository.update({ articleId }, updateArticleDto);
    return this.getArticleById(articleId);
  }

  async deleteArticle(articleId: string): Promise<Article> {
    const article = await this.getArticleById(articleId);
    if (!article) {
      throw new NotFoundException('Article was not found');
    }

    await this.articleRepository.delete({ articleId });
    return article;
  }
}
