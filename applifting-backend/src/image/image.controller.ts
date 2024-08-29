import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { multerConfig } from 'src/config/multer.config';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ImageDto } from './dtos/create-image.dto';
import { ImageService } from './image.service';

@Controller('images')
@Serialize(ImageDto)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig)) // Max 10 files per request
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.imageService.uploadImages(files);
  }

  @Get('/:imageId')
  async getImageById(@Param('imageId') imageId: string) {
    return await this.imageService.getImageById(imageId);
  }

  @Delete('/:imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    return await this.imageService.deleteImage(imageId);
  }
}
