import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ApolloServerPlugin, GraphQLRequestContext } from '@apollo/server';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignsModule } from './campaigns/campaigns.module';

// Custom Apollo Tracing Plugin
const tracingPlugin: ApolloServerPlugin = {
  async requestDidStart(requestContext: GraphQLRequestContext<any>) {
    const startTime = Date.now();
    
    return {
      async willSendResponse(requestContext) {
        const duration = Date.now() - startTime;
        const response = requestContext.response as any;
        
        // Add tracing data to response body
        const tracingData = {
          version: 1,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date().toISOString(),
          duration: duration,
          execution: {
            resolvers: [],
          },
        };
        
        // Try to add to extensions first
        if (response.body && typeof response.body === 'object') {
          const responseBody = response.body.kind === 'single' 
            ? await response.body.singleResult 
            : response.body;
          
          if (responseBody) {
            responseBody.extensions = {
              ...responseBody.extensions,
              tracing: tracingData,
            };
          }
        }
        
        // Also add to HTTP headers for visibility
        if (requestContext.request.http) {
          requestContext.request.http.headers.set('x-graphql-tracing', JSON.stringify(tracingData));
        }
      },
    };
  },
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marketing-platform', {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      include: [],
      // Enable Apollo Tracing for performance monitoring
      plugins: [tracingPlugin],
    }),
    CampaignsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
