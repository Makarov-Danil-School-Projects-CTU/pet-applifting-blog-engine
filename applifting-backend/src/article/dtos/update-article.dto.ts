import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'Some new title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'A short description of the article',
    example: 'Just a perex',
  })
  @IsString()
  @IsOptional()
  perex?: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'This is a content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'The author of the article', example: "John Wick" })
  @IsString()
  @IsOptional()
  author?: string;
}
