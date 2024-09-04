import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from '../entities/article.entity';
import { Image } from '../entities/image.entity';
import { Tenant } from '../entities/tenant.entity';
import { AccessTokenMiddleware } from '../middlewares/access-token.middleware';
import { ApiKeyMiddleware } from '../middlewares/api-key.middleware';
import { CurrentTenantMiddleware } from '../middlewares/current-tenant.middleware';
import { TenantService } from '../tenant/tenant.service';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Article, Tenant])],
  providers: [ImageService, TenantService],
  controllers: [ImageController],
})
export class ImageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, AccessTokenMiddleware, CurrentTenantMiddleware)
      .forRoutes(ImageController);
  }
}
