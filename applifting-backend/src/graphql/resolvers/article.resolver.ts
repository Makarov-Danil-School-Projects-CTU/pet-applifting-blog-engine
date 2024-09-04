import { Req, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  GqlExecutionContext,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { ArticleService } from '../../article/article.service';
import { CurrentTenantGraphQL } from '../../decorators/current-tenant.decorator';
import { Article } from '../../entities/article.entity';
import { Tenant } from '../../entities/tenant.entity';
import { AccessTokenGuard } from '../../guards/access-token.guard';
import { ApiKeyGuard } from '../../guards/api-key.guard';
import { CreateArticleInput } from '../inputs/create-article.input';
import { UpdateArticleInput } from '../inputs/update-article.input';

@Resolver(() => Article)
@UseGuards(AccessTokenGuard)
@UseGuards(ApiKeyGuard)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  // Resolver for getting all articles
  @Query(() => [Article], { name: 'getArticles' })
  async getArticles(
    @CurrentTenantGraphQL() tenant: Tenant,
  ): Promise<Article[]> {
    return this.articleService.getAllArticles(tenant.tenantId);
  }

  // Resolver for getting a specific article by ID
  @Query(() => Article, { name: 'getArticle' })
  async getArticle(
    @Args('articleId', { type: () => ID }) articleId: string,
    @CurrentTenantGraphQL() tenant: Tenant,
  ): Promise<Article> {
    return this.articleService.getArticleById(articleId, tenant.tenantId);
  }

  // Resolver for creating a new article
  @Mutation(() => Article)
  async createArticle(
    @Args('input') input: CreateArticleInput,
    @CurrentTenantGraphQL() tenant: Tenant,
  ): Promise<Article> {
    return this.articleService.createArticle(input, tenant.tenantId);
  }

  // Resolver for updating an existing article
  @Mutation(() => Article)
  async updateArticle(
    @Args('articleId', { type: () => ID }) articleId: string,
    @Args('input') input: UpdateArticleInput,
    @CurrentTenantGraphQL() tenant: Tenant,
  ): Promise<Article> {
    return this.articleService.updateArticle(articleId, input, tenant.tenantId);
  }

  // Resolver for deleting an article
  @Mutation(() => Article)
  async deleteArticle(
    @Args('articleId', { type: () => ID }) articleId: string,
    @CurrentTenantGraphQL() tenant: Tenant,
  ): Promise<Article> {
    return this.articleService.deleteArticle(articleId, tenant.tenantId);
  }
}
