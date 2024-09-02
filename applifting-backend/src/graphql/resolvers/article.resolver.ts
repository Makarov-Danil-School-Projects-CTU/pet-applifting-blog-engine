import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ArticleService } from 'src/article/article.service';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { Article } from '../../entities/article.entity';
import { CreateArticleInput } from '../inputs/create-article.input';
import { UpdateArticleInput } from '../inputs/update-article.input';

@Resolver(() => Article)
@UseGuards(AccessTokenGuard)
@UseGuards(ApiKeyGuard)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  // Resolver for getting all articles
  @Query(() => [Article], { name: 'getArticles' })
  async getArticles(): Promise<Article[]> {
    return this.articleService.getAllArticles();
  }

  // Resolver for getting a specific article by ID
  @Query(() => Article, { name: 'getArticle' })
  async getArticle(
    @Args('articleId', { type: () => ID }) articleId: string,
  ): Promise<Article> {
    return this.articleService.getArticleById(articleId);
  }

  // Resolver for creating a new article
  @Mutation(() => Article)
  async createArticle(
    @Args('input') input: CreateArticleInput,
  ): Promise<Article> {
    return this.articleService.createArticle(input);
  }

  // Resolver for updating an existing article
  @Mutation(() => Article)
  async updateArticle(
    @Args('articleId', { type: () => ID }) articleId: string,
    @Args('input') input: UpdateArticleInput,
  ): Promise<Article> {
    return this.articleService.updateArticle(articleId, input);
  }

  // Resolver for deleting an article
  @Mutation(() => Article)
  async deleteArticle(
    @Args('articleId', { type: () => ID }) articleId: string,
  ): Promise<Article> {
    return this.articleService.deleteArticle(articleId);
  }
}
