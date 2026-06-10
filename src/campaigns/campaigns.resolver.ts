import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.input';
import { CurrentTenant } from './tenant.decorator';

@Resolver(() => Campaign)
export class CampaignsResolver {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Query(() => [Campaign], { name: 'campaigns' })
  async findAll(@CurrentTenant() tenantId: string) {
    return this.campaignsService.findAll(tenantId);
  }

  @Query(() => Campaign, { name: 'campaign' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentTenant() tenantId: string
  ) {
    return this.campaignsService.findOne(id, tenantId);
  }

  @Mutation(() => Campaign)
  async createCampaign(
    @Args('createCampaignInput') createCampaignDto: CreateCampaignDto,
    @CurrentTenant() tenantId: string
  ) {
    return this.campaignsService.create(createCampaignDto, tenantId);
  }
}
