import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.input';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
  ) {}

  async findAll(tenantId: string): Promise<Campaign[]> {
    this.logger.log(`Fetching campaigns for tenant: ${tenantId}`);
    return this.campaignModel.find({ tenantId }).exec();
  }

  async findOne(id: string, tenantId: string): Promise<Campaign | null> {
    return this.campaignModel.findOne({ _id: id, tenantId }).exec();
  }

  async create(createCampaignDto: CreateCampaignDto, tenantId: string): Promise<Campaign> {
    const createdCampaign = new this.campaignModel({
      ...createCampaignDto,
      tenantId,
    });
    return createdCampaign.save();
  }

  // Example of a specialized query with indexing usage
  async findByClient(client: string): Promise<Campaign[]> {
    return this.campaignModel.find({ client }).hint({ client: 1, status: 1 }).exec();
  }
}
