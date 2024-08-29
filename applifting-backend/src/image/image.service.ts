import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { Repository } from 'typeorm';

import { Image } from 'src/entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async uploadImages(files: Express.Multer.File[]): Promise<Image[]> {
    const images: Image[] = [];

    for (const file of files) {
      const imageId = file.filename.split('.')[0];

      const url = `/uploads/${file.filename}`; // Construct the URL based on the saved file path
      // Save image metadata with the generated imageId
      const image = this.imageRepository.create({
        imageId, // Use the generated imageId
        name: imageId,
        path: file.path, // Path on the local disk
        url, // URL to access the image
      });

      images.push(await this.imageRepository.save(image));
    }

    return images;
  }

  async getImageById(imageId: string): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { imageId } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
    return image;
  }

  async deleteImage(imageId: string): Promise<Image> {
    const image = await this.getImageById(imageId); // Get the image to ensure it exists

    const result = await this.imageRepository.delete({ imageId });
    if (result.affected === 0) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    // Delete the file from the local storage
    try {
      await unlink(image.path); // Delete the file from disk
    } catch (error) {
      console.error(`Failed to delete image file from disk: ${error.message}`);
    }

    return image;
  }
}
