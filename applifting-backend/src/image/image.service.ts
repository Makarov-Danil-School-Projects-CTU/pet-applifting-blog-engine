import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, ReadStream } from 'fs';
import * as fs from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
import { Image } from '../entities/image.entity';
import { Tenant } from '../entities/tenant.entity';
import { CreateImageDto } from './dtos/create-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async getImageById(
    imageId: string,
    tenantId: string,
  ): Promise<{
    file: ReadStream;
    mimeType: string;
    filename: string;
    size: number;
  }> {
    try {
      // Find image metadata in the database
      const image = await this.imageRepository.findOne({
        where: {
          imageId,
          tenant: { tenantId },
        },
        relations: ['tenant'],
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
    tenantId: string,
  ): Promise<Image> {
    const { articleId } = imageDto;

    const article = await this.articleRepository.findOne({
      where: {
        articleId,
        tenant: { tenantId },
      },
      relations: ['tenant', 'image'], // Include the 'image' relation to check existing image
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }

    const tenant = await this.tenantRepository.findOneBy({ tenantId });

    if (!tenant) {
      throw new NotFoundException('Tenant was not found');
    }

    // Handle existing image if present
    await this.handleExistingImage(article.image);

    // Ensure upload directory exists
    const uploadDir = join(__dirname, '../../uploads');
    await this.ensureDirectoryExists(uploadDir);

    const filePath = join(uploadDir, file.originalname);

    // Store the new file on disk
    await this.storeFileOnDisk(filePath, file.buffer);

    // Create and save the new image record
    const image = this.imageRepository.create({
      name: file.originalname,
      mimeType: file.mimetype,
      url: `http://localhost:4000/uploads/${file.originalname}`, // Adjust URL to match your server setup
      article,
      tenant,
    });

    return this.imageRepository.save(image);
  }

  private async handleExistingImage(image: Image | undefined) {
    if (!image) return;

    const oldImagePath = join(__dirname, '../../uploads', image.name);

    try {
      await fs.unlink(oldImagePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        // Ignore error if the file does not exist
        throw new Error(`Failed to delete old image: ${err.message}`);
      }
    }

    await this.imageRepository.delete({ imageId: image.imageId });
  }

  private async ensureDirectoryExists(directoryPath: string) {
    try {
      await fs.mkdir(directoryPath, { recursive: true });
    } catch (err) {
      throw new Error(`Failed to create upload directory: ${err.message}`);
    }
  }

  private async storeFileOnDisk(filePath: string, buffer: Buffer) {
    try {
      await fs.writeFile(filePath, buffer);
    } catch (err) {
      throw new Error(`Failed to write file: ${err.message}`);
    }
  }

  async deleteImage(imageId: string, tenantId: string): Promise<Image> {
    try {
      const image = await this.imageRepository.findOne({
        where: {
          imageId,
          tenant: { tenantId },
        },
        relations: ['tenant'],
      });

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
