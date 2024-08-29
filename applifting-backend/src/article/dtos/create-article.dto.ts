import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  perex: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsUUID()
  @IsOptional()
  imageId?: string;
}
