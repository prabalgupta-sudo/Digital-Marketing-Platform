import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Bootstrap function
 * Initializes the NestJS application with proper configuration
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  const port = process.env.PORT || 4001;
  await app.listen(port);

  console.log(`🚀 User Service is running on: http://localhost:${port}/graphql`);
  console.log(`📚 GraphQL Playground: http://localhost:${port}/graphql`);
}

bootstrap();
