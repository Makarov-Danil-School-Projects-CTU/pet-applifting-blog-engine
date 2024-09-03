import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Applifting backend blog engine')
    .setDescription('API description for my NestJS application')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'UUID for authorization, set in the Authorization header without "Bearer " prefix',
      },
      'UUIDAuth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
      },
      'ApiKeyAuth', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(4000);
}
bootstrap();
