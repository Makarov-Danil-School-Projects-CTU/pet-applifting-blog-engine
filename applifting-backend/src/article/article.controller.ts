import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ArticleService } from './article.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  getAllArticles() {
    return this.articleService.getAllArticles();
  }

  @Get(':articleId')
  getArticleById(@Param('articleId') articleId: string) {
    return this.articleService.getArticleById(articleId);
  }

  @Post()
  createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto);
  }

  @Patch(':articleId')
  updateArticle(
    @Param('articleId') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(articleId, updateArticleDto);
  }

  @Delete(':articleId')
  deleteArticle(@Param('articleId') articleId: string) {
    return this.articleService.deleteArticle(articleId);
  }
}
