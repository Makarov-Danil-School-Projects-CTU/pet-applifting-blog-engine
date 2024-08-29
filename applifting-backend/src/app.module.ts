import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { TenantModule } from './tenant/tenant.module';
import { CommentModule } from './comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    TenantModule,
    ArticleModule,
    CommentModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Validation pipe checks all imcoming DTOs
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
