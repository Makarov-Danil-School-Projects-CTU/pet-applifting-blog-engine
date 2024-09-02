import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ImageResponseDto {
  @ApiProperty({ description: 'The unique identifier of the image' })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  imageId: string;

  @ApiProperty({ description: 'The original name of the uploaded image file' })
  @Expose()
  @IsString()
  name: string;
}