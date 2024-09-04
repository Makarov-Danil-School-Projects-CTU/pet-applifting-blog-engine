import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'Some new title',
  })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'A short description of the article',
    example: 'Just a perex',
  })
  @IsString()
  @Length(1, 250)
  @IsOptional()
  perex?: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'This is a content',
  })
  @IsString()
  @IsOptional()
  @Length(1)
  content?: string;
}
