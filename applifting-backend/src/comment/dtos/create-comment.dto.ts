import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The ID of the article the comment is related to',
    example: '9fc3e31f-ccf1-4748-8e0e-53a3251fa9c6',
  })
  @IsUUID()
  @IsNotEmpty()
  articleId: string;

  @ApiProperty({
    description: 'The author of the comment',
    example: 'John Wick',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'The content of the comment',
    example: 'Just a content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
