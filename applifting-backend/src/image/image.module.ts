import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Image } from '../entities/image.entity';
import { AccessTokenMiddleware } from '../middlewares/access-token.middleware';
import { ApiKeyMiddleware } from '../middlewares/api-key.middleware';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { Article } from '../entities/article.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Image, Article])],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, AccessTokenMiddleware)
      .forRoutes(ImageController);
  }
}
