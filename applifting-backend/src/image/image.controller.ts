import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { Image } from '../entities/image.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateImageDto } from './dtos/create-image.dto';
import { ImageResponseDto } from './dtos/image-response.dto';
import { ImageService } from './image.service';

@ApiTags('Images')
@Controller('images')
@ApiSecurity('ApiKeyAuth')
@ApiSecurity('UUIDAuth')
@Serialize(ImageResponseDto)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post(':articleId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image for a specific article' })
  @ApiParam({
    name: 'articleId',
    type: String,
    description: 'The ID of the article to associate with the image',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'articleId',
    type: String,
    description: 'The ID of the article to associate with the image',
  })
  @ApiBody({
    description: 'Image file',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image successfully uploaded.',
    type: ImageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async uploadImage(
    @Param('articleId') articleId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    const uploadInput = {
      articleId,
      name: file.originalname,
      mimeType: file.mimetype,
    } as CreateImageDto;

    return this.imageService.uploadImage(uploadInput, file);
  }

  @Get(':imageId')
  @ApiOperation({ summary: 'Download an image by ID' })
  @ApiParam({
    name: 'imageId',
    type: String,
    description: 'The ID of the image to download',
  })
  @ApiResponse({
    status: 200,
    description: 'The image has been successfully downloaded.',
    content: {
      'application/octet-stream': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  async downloadImage(
    @Param('imageId') imageId: string,
    @Res() res: Response,
  ): Promise<void> {
    const { file, mimeType, filename, size } =
      await this.imageService.getImageById(imageId);

    // Set the correct headers for content type and content disposition
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', size);
    // Pipe the file stream to the response
    file.pipe(res);
  }

  @Delete(':imageId')
  @ApiOperation({ summary: 'Delete an image by ID' })
  @ApiParam({
    name: 'imageId',
    type: String,
    description: 'The ID of the image to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Image successfully deleted.',
    type: Image,
  })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  async deleteImage(@Param('imageId') imageId: string): Promise<Image> {
    return this.imageService.deleteImage(imageId);
  }
}
