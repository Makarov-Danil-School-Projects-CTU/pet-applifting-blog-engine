import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: 'The title of the article' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'A short description of the article' })
  @IsString()
  @IsNotEmpty()
  perex: string;

  @ApiProperty({ description: 'The content of the article' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The ID of the tenant associated with the article' })
  @IsUUID()
  @IsOptional()
  tenantId: string;
}
