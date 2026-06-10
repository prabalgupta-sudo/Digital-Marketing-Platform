import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsService } from './campaigns.service';
import { CampaignsResolver } from './campaigns.resolver';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { MultiTenantMiddleware } from './multi-tenant.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
  ],
  providers: [CampaignsResolver, CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MultiTenantMiddleware)
      .forRoutes('*');
  }
}
