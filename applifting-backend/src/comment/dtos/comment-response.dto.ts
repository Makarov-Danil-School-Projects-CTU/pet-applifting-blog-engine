import { Expose, Transform } from 'class-transformer';

export class CommentResponseDto {
  @Expose()
  commentId: string;

  @Transform(({ obj }) => obj.article.articleId)
  @Expose()
  articleId: string;

  @Expose()
  author: string;

  @Expose()
  content: string;

  @Expose()
  postedAt: Date;

  @Expose()
  score: number;
}
