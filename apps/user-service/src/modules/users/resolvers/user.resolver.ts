import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UsersService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

/**
 * UserResolver - GraphQL API Layer
 * Handles GraphQL queries and mutations
 * Following Single Responsibility Principle
 */
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'user' })
  async getUser(
    @Args('id', { type: () => ID }) id: string,
    @Context('tenantId') tenantId: string,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'userByEmail', nullable: true })
  async getUserByEmail(
    @Args('email') email: string,
    @Context('tenantId') tenantId: string,
  ): Promise<User> {
    return this.usersService.findByEmail(email, tenantId);
  }

  @Query(() => [User], { name: 'users' })
  async getUsers(
    @Context('tenantId') tenantId: string,
  ): Promise<User[]> {
    return this.usersService.findAll(tenantId);
  }

  @Query(() => [User], { name: 'usersByTeam' })
  async getUsersByTeam(
    @Args('teamId', { type: () => ID }) teamId: string,
    @Context('tenantId') tenantId: string,
  ): Promise<User[]> {
    return this.usersService.findByTeam(teamId, tenantId);
  }

  @Query(() => [User], { name: 'usersByRole' })
  async getUsersByRole(
    @Args('role') role: string,
    @Context('tenantId') tenantId: string,
  ): Promise<User[]> {
    return this.usersService.findByRole(role, tenantId);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User> {
    return this.usersService.remove(id);
  }

  @Query(() => String, { name: 'userStats' })
  async getUserStats(
    @Context('tenantId') tenantId: string,
  ): Promise<string> {
    const stats = await this.usersService.getUserStats(tenantId);
    return JSON.stringify(stats);
  }
}
