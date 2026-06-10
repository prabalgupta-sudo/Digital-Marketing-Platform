import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import * as bcrypt from 'bcrypt';

/**
 * UserService - Business Logic Layer
 * Implements Service Layer Pattern
 * Following SOLID Principles:
 * - Single Responsibility: Handles only user business logic
 * - Dependency Inversion: Depends on Repository abstraction
 */
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserInput): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
      createUserDto.tenantId,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password from DTO
    const hashedPassword = await bcrypt.hash(createUserDto.password || 'defaultPassword', 10);

    const userWithDefaults = {
      ...createUserDto,
      passwordHash: hashedPassword,
      preferences: createUserDto.preferences || {
        timezone: 'UTC',
        currency: 'USD',
        language: 'en',
      },
      permissions: createUserDto.permissions || this.getDefaultPermissions(
        createUserDto.role,
      ),
    };

    return this.userRepository.create(userWithDefaults);
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.userRepository.findAll(tenantId);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string, tenantId: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email, tenantId);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByTeam(teamId: string, tenantId: string): Promise<User[]> {
    return this.userRepository.findByTeam(teamId, tenantId);
  }

  async update(id: string, updateUserDto: UpdateUserInput): Promise<User> {
    await this.findOne(id); // Ensure user exists
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<User> {
    await this.findOne(id); // Ensure user exists
    return this.userRepository.softDelete(id);
  }

  async getUserStats(tenantId: string) {
    return this.userRepository.getUserStats(tenantId);
  }

  /**
   * Helper method to assign default permissions based on role
   * Demonstrates encapsulation and single responsibility
   */
  private getDefaultPermissions(role: string): string[] {
    const permissionsMap = {
      ADMIN: ['*'],
      CAMPAIGN_MANAGER: [
        'campaign:create',
        'campaign:update',
        'campaign:delete',
        'budget:view',
        'budget:approve',
      ],
      ANALYST: [
        'campaign:view',
        'analytics:view',
        'report:generate',
      ],
      VIEWER: [
        'campaign:view',
      ],
    };

    return permissionsMap[role] || permissionsMap.VIEWER;
  }
}
