import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Image } from 'src/entities/image.entity';
import { AccessTokenMiddleware } from 'src/middlewares/access-token.middleware';
import { ApiKeyMiddleware } from 'src/middlewares/api-key.middleware';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
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
