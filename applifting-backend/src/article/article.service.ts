import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Article } from 'src/entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(createArticleDto);
    return await this.articleRepository.save(article);
  }

  async getAllArticles(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async getArticleById(articleId: string): Promise<Article> {
    return await this.articleRepository.findOne({ where: { articleId } });
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
