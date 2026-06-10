import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

/**
 * UserRepository - Data Access Layer
 * Implements Repository Pattern for data abstraction
 * Following Single Responsibility Principle
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserInput): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(tenantId: string): Promise<UserDocument[]> {
    return this.userModel.find({ tenantId, isActive: true }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string, tenantId: string): Promise<UserDocument> {
    return this.userModel.findOne({ email, tenantId }).exec();
  }

  async findByTeam(teamId: string, tenantId: string): Promise<UserDocument[]> {
    return this.userModel.find({ teamId, tenantId, isActive: true }).exec();
  }

  async findByRole(role: string, tenantId: string): Promise<UserDocument[]> {
    return this.userModel.find({ role, tenantId, isActive: true }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserInput): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async findActiveUsers(tenantId: string): Promise<UserDocument[]> {
    return this.userModel
      .find({ tenantId, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUserStats(tenantId: string) {
    return this.userModel.aggregate([
      { $match: { tenantId, isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);
  }
}
