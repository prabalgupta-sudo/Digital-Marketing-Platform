import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsResolver } from './resolvers/campaign.resolver';
import { CampaignsService } from './services/campaign.service';
import { CampaignRepository } from './repositories/campaign.repository';
import { Campaign, CampaignSchema } from './entities/campaign.entity';

/**
 * CampaignsModule - Encapsulates all campaign-related functionality
 * Demonstrates Module Pattern and Dependency Injection
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
  ],
  providers: [
    CampaignsResolver,
    CampaignsService,
    CampaignRepository,
  ],
  exports: [
    CampaignsService,
    CampaignRepository,
  ],
})
export class CampaignsModule {}
