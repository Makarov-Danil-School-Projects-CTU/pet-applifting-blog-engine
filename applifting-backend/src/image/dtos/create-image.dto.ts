import { ApiProperty } from '@nestjs/swagger';
import {
  IsMimeType,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ description: 'The unique identifier of the image' })
  @IsUUID()
  @IsNotEmpty()
  imageId: string;

  @ApiProperty({
    description: 'The ID of the article to which the image is associated',
  })
  @IsUUID()
  @IsNotEmpty()
  articleId: string;

  @ApiProperty({ description: 'The original name of the uploaded image file' })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  name: string;

  @ApiProperty({ description: 'The MIME type of the uploaded image file' })
  @IsMimeType()
  @IsNotEmpty()
  mimeType: string;
}
