import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersResolver } from './resolvers/user.resolver';
import { UsersService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './entities/user.entity';

/**
 * UsersModule - Encapsulates all user-related functionality
 * Demonstrates Module Pattern and Dependency Injection
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersResolver,
    UsersService,
    UserRepository,
  ],
  exports: [
    UsersService,
    UserRepository,
  ],
})
export class UsersModule {}
