import { Expose, Transform, Type } from "class-transformer"
import { CommentResponseDto } from "../../comment/dtos/comment-response.dto"

export class ArticleResponseDto {
  @Expose()
  articleId: string
  
  @Expose()
  title: string

  @Expose()
  perex: string

  @Expose()
  content: string

  @Expose()
  @Transform(({ obj }) => obj.tenant.tenantId)
  tenantId: string

  @Expose()
  @Type(() => CommentResponseDto)
  comments: CommentResponseDto[];

  @Expose()
  lastUpdatedAt: Date

  @Expose()
  createdAt: Date
}