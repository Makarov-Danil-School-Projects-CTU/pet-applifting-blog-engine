import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppDataSource } from '../data-source';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';
import { CurrentTenantMiddleware } from './middlewares/current-tenant.middleware';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return AppDataSource.options; // Return the options from your DataSource
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, connection }) => {
        // For subscriptions
        if (connection) {
          return {
            req: connection.context,
          };
        }
        // For queries and mutations
        return { req };
      },
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql/graphql.ts'),
        outputAs: 'class',
      },
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
      },
    }),
    AuthModule,
    TenantModule,
    ArticleModule,
    CommentModule,
    ImageModule,
  ],
  providers: [
    // Comment if we work with graphql
    // this validation pipe does not pass graphql requests
    // {
    //   provide: APP_PIPE,
    //   useValue: new ValidationPipe({
    //     whitelist: true
    //   }),
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentTenantMiddleware).forRoutes('/graphql'); // Apply middleware only to the /graphql route
  }
}
