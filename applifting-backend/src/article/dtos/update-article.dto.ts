import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  perex?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsUUID()
  @IsOptional()
  imageId?: string;
}