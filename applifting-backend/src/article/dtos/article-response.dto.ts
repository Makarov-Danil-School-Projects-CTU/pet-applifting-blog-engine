import { Expose, Transform } from "class-transformer"
import { Comment } from "../../entities/comment.entity"

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
  comments: Comment[]

  @Expose()
  lastUpdatedAt: Date

  @Expose()
  createdAt: Date
}