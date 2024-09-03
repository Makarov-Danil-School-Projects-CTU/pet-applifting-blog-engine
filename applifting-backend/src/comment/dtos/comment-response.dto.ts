import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CommentResponseDto {
  @ApiProperty({ description: 'The unique identifier of the comment' })
  @Expose()
  commentId: string;

  @ApiProperty({
    description: 'The ID of the article the comment is related to',
  })
  
  @Transform(({ obj }) => obj.article.articleId)
  @Expose()
  articleId: string;

  @ApiProperty({ description: 'The author of the comment' })
  @Expose()
  author: string;

  @ApiProperty({ description: 'The content of the comment' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'The date the comment was posted' })
  @Expose()
  postedAt: Date;

  @ApiProperty({ description: 'The score of the comment' })
  @Expose()
  score: number;
}
