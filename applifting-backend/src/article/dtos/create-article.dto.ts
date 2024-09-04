import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'Some new title',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @ApiProperty({
    description: 'A short description of the article',
    example: 'Just a perex',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  perex: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'This is a content',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  content: string;
}
