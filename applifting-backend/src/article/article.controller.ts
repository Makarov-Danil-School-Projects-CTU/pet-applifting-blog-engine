import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentTenant } from '../decorators/current-tenant.decorator';
import { Article } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ArticleService } from './article.service';
import { ArticleResponseDto } from './dtos/article-response.dto';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@ApiTags('Articles')
@ApiSecurity('ApiKeyAuth')
@ApiSecurity('UUIDAuth')
@Controller('articles')
@Serialize(ArticleResponseDto)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all articles' })
  @ApiResponse({
    status: 200,
    description: 'List of all articles',
    type: [Article],
  })
  getAllArticles(@CurrentTenant() tenant: Tenant): Promise<Article[]> {
    return this.articleService.getAllArticles(tenant.tenantId);
  }

  @Get(':articleId')
  @ApiOperation({ summary: 'Retrieve an article by ID' })
  @ApiParam({
    name: 'articleId',
    type: String,
    description: 'The ID of the article to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The article with the specified ID',
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  getArticleById(
    @Param('articleId') articleId: string,
    @CurrentTenant() tenant: Tenant,
  ): Promise<Article> {
    return this.articleService.getArticleById(articleId, tenant.tenantId);
  }
  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBody({
    type: CreateArticleDto,
    description: 'Data required to create a new article',
  })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
    type: Article,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentTenant() tenant: Tenant,
  ): Promise<Article> {
    return this.articleService.createArticle(createArticleDto, tenant.tenantId);
  }

  @Patch(':articleId')
  @ApiOperation({ summary: 'Update an existing article' })
  @ApiParam({
    name: 'articleId',
    type: String,
    description: 'The ID of the article to update',
  })
  @ApiBody({
    type: UpdateArticleDto,
    description: 'Data required to update the article',
  })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully updated.',
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  updateArticle(
    @Param('articleId') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentTenant() tenant: Tenant,
  ): Promise<Article> {
    return this.articleService.updateArticle(
      articleId,
      updateArticleDto,
      tenant.tenantId,
    );
  }

  @Delete(':articleId')
  @ApiOperation({ summary: 'Delete an article by ID' })
  @ApiParam({
    name: 'articleId',
    type: String,
    description: 'The ID of the article to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully deleted.',
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  deleteArticle(
    @Param('articleId') articleId: string,
    @CurrentTenant() tenant: Tenant,
  ): Promise<Article> {
    return this.articleService.deleteArticle(articleId, tenant.tenantId);
  }
}
