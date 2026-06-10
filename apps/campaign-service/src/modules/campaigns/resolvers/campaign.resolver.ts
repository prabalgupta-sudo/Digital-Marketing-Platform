import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { CampaignsService } from '../services/campaign.service';
import { Campaign } from '../entities/campaign.entity';
import { CreateCampaignInput } from '../dto/create-campaign.input';
import { UpdateCampaignInput } from '../dto/update-campaign.input';

/**
 * CampaignResolver - GraphQL API Layer
 * Handles GraphQL queries and mutations for campaigns
 * Following Single Responsibility Principle
 */
@Resolver(() => Campaign)
export class CampaignsResolver {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Query(() => Campaign, { name: 'campaign' })
  async getCampaign(
    @Args('id', { type: () => ID }) id: string,
    @Context('tenantId') tenantId: string,
  ): Promise<Campaign> {
    return this.campaignsService.findOne(id);
  }

  @Query(() => [Campaign], { name: 'campaigns' })
  async getCampaigns(
    @Context('tenantId') tenantId: string,
  ): Promise<Campaign[]> {
    return this.campaignsService.findAll(tenantId);
  }

  @Query(() => [Campaign], { name: 'campaignsByOwner' })
  async getCampaignsByOwner(
    @Args('ownerId', { type: () => ID }) ownerId: string,
    @Context('tenantId') tenantId: string,
  ): Promise<Campaign[]> {
    return this.campaignsService.findByOwner(ownerId, tenantId);
  }

  @Query(() => [Campaign], { name: 'campaignsByTeam' })
  async getCampaignsByTeam(
    @Args('teamId', { type: () => ID }) teamId: string,
    @Context('tenantId') tenantId: string,
  ): Promise<Campaign[]> {
    return this.campaignsService.findByTeam(teamId, tenantId);
  }

  @Query(() => [Campaign], { name: 'campaignsByStatus' })
  async getCampaignsByStatus(
    @Args('status') status: string,
    @Context('tenantId') tenantId: string,
  ): Promise<Campaign[]> {
    return this.campaignsService.findByStatus(status, tenantId);
  }

  @Query(() => [Campaign], { name: 'searchCampaigns' })
  async searchCampaigns(
    @Args('searchTerm') searchTerm: string,
    @Context('tenantId') tenantId: string,
  ): Promise<Campaign[]> {
    return this.campaignsService.searchCampaigns(searchTerm, tenantId);
  }

  @Mutation(() => Campaign)
  async createCampaign(
    @Args('createCampaignInput') createCampaignInput: CreateCampaignInput,
  ): Promise<Campaign> {
    return this.campaignsService.create(createCampaignInput);
  }

  @Mutation(() => Campaign)
  async updateCampaign(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCampaignInput') updateCampaignInput: UpdateCampaignInput,
  ): Promise<Campaign> {
    return this.campaignsService.update(id, updateCampaignInput);
  }

  @Mutation(() => Campaign)
  async deleteCampaign(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Campaign> {
    return this.campaignsService.remove(id);
  }

  @Query(() => String, { name: 'campaignStats' })
  async getCampaignStats(
    @Context('tenantId') tenantId: string,
  ): Promise<string> {
    const stats = await this.campaignsService.getCampaignStats(tenantId);
    return JSON.stringify(stats);
  }

  @Query(() => String, { name: 'channelPerformance' })
  async getChannelPerformance(
    @Context('tenantId') tenantId: string,
  ): Promise<string> {
    const performance = await this.campaignsService.getChannelPerformance(tenantId);
    return JSON.stringify(performance);
  }
}
