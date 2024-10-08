import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ImageResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the image',
    example: '9fc3e31f-ccf1-4748-8e0e-53a3251fa9c6',
  })
  @Expose()
  imageId: string;

  @ApiProperty({
    description: 'The original name of the uploaded image file',
    example: 'Hello kitty',
  })
  @Expose()
  name: string;
}
