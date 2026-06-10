import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CampaignsModule } from './modules/campaigns/campaigns.module';

/**
 * AppModule - Root Module for Campaign Service
 * Configures GraphQL Federation with Apollo
 * Demonstrates Dependency Injection and Module Composition
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/campaign-service',
      {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      },
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      // Federation configuration
      federation: true,
      buildFederatedSchema: true,
    }),
    CampaignsModule,
  ],
})
export class AppModule {}
