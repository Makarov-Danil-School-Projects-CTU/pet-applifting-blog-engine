import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'Some new title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A short description of the article',
    example: 'Just a perex',
  })
  @IsString()
  @IsNotEmpty()
  perex: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'This is a content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The ID of the tenant associated with the article',
    example: 'ae5c7e79-cd6c-4486-b351-2911819fca33',
  })
  @IsUUID()
  @IsOptional()
  tenantId: string;
}
