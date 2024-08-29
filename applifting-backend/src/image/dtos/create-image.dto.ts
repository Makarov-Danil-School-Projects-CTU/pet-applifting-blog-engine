import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ImageDto {
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  imageId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateImageDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];
}
