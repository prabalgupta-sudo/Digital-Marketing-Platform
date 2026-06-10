import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '../entities/campaign.entity';
import { CreateCampaignInput } from '../dto/create-campaign.input';
import { UpdateCampaignInput } from '../dto/update-campaign.input';

/**
 * CampaignRepository - Data Access Layer
 * Implements Repository Pattern for campaign data abstraction
 * Following Single Responsibility Principle
 */
@Injectable()
export class CampaignRepository {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async create(createCampaignDto: CreateCampaignInput): Promise<CampaignDocument> {
    const createdCampaign = new this.campaignModel(createCampaignDto);
    return createdCampaign.save();
  }

  async findAll(tenantId: string): Promise<CampaignDocument[]> {
    return this.campaignModel.find({ tenantId, isActive: true }).exec();
  }

  async findById(id: string): Promise<CampaignDocument> {
    return this.campaignModel.findById(id).exec();
  }

  async findByOwner(ownerId: string, tenantId: string): Promise<CampaignDocument[]> {
    return this.campaignModel.find({ ownerId, tenantId, isActive: true }).exec();
  }

  async findByTeam(teamId: string, tenantId: string): Promise<CampaignDocument[]> {
    return this.campaignModel.find({ teamId, tenantId, isActive: true }).exec();
  }

  async findByStatus(status: string, tenantId: string): Promise<CampaignDocument[]> {
    return this.campaignModel.find({ status, tenantId, isActive: true }).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date, tenantId: string): Promise<CampaignDocument[]> {
    return this.campaignModel.find({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
      tenantId,
      isActive: true,
    }).exec();
  }

  async findByChannel(channelType: string, tenantId: string): Promise<CampaignDocument[]> {
    return this.campaignModel.find({
      'channels.type': channelType,
      tenantId,
      isActive: true,
    }).exec();
  }

  async searchCampaigns(searchTerm: string, tenantId: string): Promise<CampaignDocument[]> {
    return this.campaignModel.find({
      $text: { $search: searchTerm },
      tenantId,
      isActive: true,
    }).exec();
  }

  async update(id: string, updateCampaignDto: UpdateCampaignInput): Promise<CampaignDocument> {
    return this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<CampaignDocument> {
    return this.campaignModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async getCampaignStats(tenantId: string) {
    return this.campaignModel.aggregate([
      { $match: { tenantId, isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: '$spent' },
        },
      },
    ]);
  }

  async getChannelPerformance(tenantId: string) {
    return this.campaignModel.aggregate([
      { $match: { tenantId, isActive: true } },
      { $unwind: '$channels' },
      {
        $group: {
          _id: '$channels.type',
          totalCampaigns: { $sum: 1 },
          totalBudget: { $sum: '$channels.budget' },
          totalSpent: { $sum: '$channels.spent' },
          avgSpendPercentage: {
            $avg: {
              $multiply: [
                { $divide: ['$channels.spent', '$channels.budget'] },
                100,
              ],
            },
          },
        },
      },
      { $sort: { totalBudget: -1 } },
    ]);
  }
}
