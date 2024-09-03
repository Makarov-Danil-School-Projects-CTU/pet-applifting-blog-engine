import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, ReadStream } from 'fs';
import * as fs from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
import { Image } from '../entities/image.entity';
import { CreateImageDto } from './dtos/create-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async getImageById(imageId: string): Promise<{
    file: ReadStream;
    mimeType: string;
    filename: string;
    size: number;
  }> {
    try {
      // Find image metadata in the database
      const image = await this.imageRepository.findOne({
        where: { imageId },
        relations: ['article'],
      });

      if (!image) {
        throw new NotFoundException(`Image with ID ${imageId} not found`);
      }

      // Construct the path to the image file
      const imagePath = join(__dirname, '../../uploads', image.name);
      // Check if the file exists before creating the read stream

      try {
        await fs.access(imagePath);
      } catch {
        throw new NotFoundException(
          `Image file not found at path: ${imagePath}`,
        );
      }

      const file = createReadStream(imagePath);
      const stat = await fs.stat(imagePath);

      return {
        file,
        mimeType: image.mimeType,
        filename: image.name,
        size: stat.size,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to retrieve image with ID ${imageId}: ${error.message}`,
      );
    }
  }

  async uploadImage(
    imageDto: CreateImageDto,
    file: Express.Multer.File,
  ): Promise<Image> {
    const { articleId } = imageDto;

    const article = await this.articleRepository.findOne({
      where: { articleId },
      relations: ['image'],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }

    const uploadDir = join(__dirname, '../../uploads');
    const filePath = join(uploadDir, file.originalname);

    // Check if the article already has an image and delete it
    if (article.image) {
      const oldImagePath = join(uploadDir, article.image.name);

      try {
        // Remove old image from filesystem if it exists
        await fs.unlink(oldImagePath);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          // Ignore error if the file does not exist
          throw err;
        }
      }

      await this.imageRepository.delete({ imageId: article.image.imageId });
    }

    // Store the new file on disk

    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      throw new Error(`Failed to create upload directory: ${err.message}`);
    }

    try {
      await fs.writeFile(filePath, file.buffer);
    } catch (err) {
      throw new Error(`Failed to write file: ${err.message}`);
    }

    // Create a new image record
    const image = this.imageRepository.create({
      name: file.originalname,
      mimeType: file.mimetype,
      url: `http://localhost:4000/uploads/${file.originalname}`, // Adjust URL to match your server setup
      article,
    });

    return this.imageRepository.save(image);
  }

  async deleteImage(imageId: string): Promise<Image> {
    try {
      const image = await this.imageRepository.findOne({ where: { imageId } });

      if (!image) {
        throw new NotFoundException('Image was not found');
      }

      // Construct the file path to delete the image from the filesystem
      const imagePath = join(__dirname, '../../uploads', image.name);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw new Error(`Failed to delete image file: ${error.message}`);
        }
        // If the file does not exist, proceed without throwing an error
      }

      await this.imageRepository.delete({ imageId });
      return image;
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete image with ID ${imageId}: ${error.message}`,
      );
    }
  }
}
