import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @ApiPropertyOptional({ description: 'The title of the article' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'A short description of the article' })
  @IsString()
  @IsOptional()
  perex?: string;

  @ApiPropertyOptional({ description: 'The content of the article' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'The author of the article' })
  @IsString()
  @IsOptional()
  author?: string;
}
