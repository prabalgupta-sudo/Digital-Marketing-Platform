import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { AnalyticsService } from '../services/analytics.service';
import { KPI } from '../entities/kpi.entity';
import { Analytics } from '../entities/analytics.entity';
import { CreateKPIInput } from '../dto/create-kpi.input';

/**
 * AnalyticsResolver - GraphQL API Layer
 * Handles GraphQL queries and mutations for analytics
 * Following Single Responsibility Principle
 */
@Resolver(() => KPI)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // KPI Queries and Mutations
  @Query(() => KPI, { name: 'kpi' })
  async getKPI(
    @Args('id', { type: () => ID }) id: string,
    @Context('tenantId') tenantId: string,
  ): Promise<KPI> {
    return this.analyticsService.findKPIById(id);
  }

  @Query(() => [KPI], { name: 'kpis' })
  async getKPIs(
    @Context('tenantId') tenantId: string,
  ): Promise<KPI[]> {
    return this.analyticsService.findKPIsByTenant(tenantId);
  }

  @Query(() => [KPI], { name: 'kpisByCampaign' })
  async getKPIsByCampaign(
    @Args('campaignId', { type: () => ID }) campaignId: string,
  ): Promise<KPI[]> {
    return this.analyticsService.findKPIsByCampaign(campaignId);
  }

  @Mutation(() => KPI)
  async createKPI(
    @Args('createKPIInput') createKPIInput: CreateKPIInput,
  ): Promise<KPI> {
    return this.analyticsService.createKPI(createKPIInput);
  }

  @Mutation(() => KPI)
  async updateKPI(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateData') updateData: any,
  ): Promise<KPI> {
    return this.analyticsService.updateKPI(id, updateData);
  }

  // Analytics Queries
  @Query(() => Analytics, { name: 'analytics' })
  async getAnalytics(
    @Args('id', { type: () => ID }) id: string,
    @Context('tenantId') tenantId: string,
  ): Promise<Analytics> {
    return this.analyticsService.findAnalyticsById(id);
  }

  @Query(() => [Analytics], { name: 'analyticsByCampaign' })
  async getAnalyticsByCampaign(
    @Args('campaignId', { type: () => ID }) campaignId: string,
  ): Promise<Analytics[]> {
    return this.analyticsService.findAnalyticsByCampaign(campaignId);
  }

  @Query(() => [Analytics], { name: 'analyticsByDateRange' })
  async getAnalyticsByDateRange(
    @Args('campaignId', { type: () => ID }) campaignId: string,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<Analytics[]> {
    return this.analyticsService.findAnalyticsByCampaignAndDateRange(
      campaignId,
      startDate,
      endDate,
    );
  }

  @Query(() => Analytics, { name: 'latestAnalytics' })
  async getLatestAnalytics(
    @Args('campaignId', { type: () => ID }) campaignId: string,
  ): Promise<Analytics> {
    return this.analyticsService.findLatestAnalyticsByCampaign(campaignId);
  }

  @Mutation(() => Analytics)
  async createAnalytics(
    @Args('analyticsData') analyticsData: any,
  ): Promise<Analytics> {
    return this.analyticsService.createAnalytics(analyticsData);
  }

  // Aggregation Queries
  @Query(() => String, { name: 'campaignPerformanceSummary' })
  async getCampaignPerformanceSummary(
    @Args('campaignId', { type: () => ID }) campaignId: string,
  ): Promise<string> {
    const summary = await this.analyticsService.getCampaignPerformanceSummary(campaignId);
    return JSON.stringify(summary);
  }

  @Query(() => String, { name: 'kpiPerformanceTrends' })
  async getKPIPerformanceTrends(
    @Context('tenantId') tenantId: string,
  ): Promise<string> {
    const trends = await this.analyticsService.getKPIPerformanceTrends(tenantId);
    return JSON.stringify(trends);
  }

  @Query(() => String, { name: 'topPerformingCampaigns' })
  async getTopPerformingCampaigns(
    @Context('tenantId') tenantId: string,
    @Args('limit', { nullable: true }) limit?: number,
  ): Promise<string> {
    const campaigns = await this.analyticsService.getTopPerformingCampaigns(
      tenantId,
      limit || 10,
    );
    return JSON.stringify(campaigns);
  }
}
