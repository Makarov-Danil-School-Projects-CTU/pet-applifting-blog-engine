import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateImageDto {
  @ApiProperty({ description: 'The unique identifier of the image' })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  imageId: string;

  @ApiProperty({ description: 'The ID of the article to which the image is associated' })
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  articleId: string;

  @ApiProperty({ description: 'The original name of the uploaded image file' })
  @Expose()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The MIME type of the uploaded image file' })
  @IsString()
  mimeType: string;
}