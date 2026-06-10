import { Injectable, NotFoundException } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { KPI } from '../entities/kpi.entity';
import { Analytics } from '../entities/analytics.entity';
import { CreateKPIInput } from '../dto/create-kpi.input';

/**
 * AnalyticsService - Business Logic Layer
 * Implements Service Layer Pattern
 * Following SOLID Principles:
 * - Single Responsibility: Handles only analytics business logic
 * - Dependency Inversion: Depends on Repository abstraction
 */
@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  // KPI Operations
  async createKPI(createKpiDto: CreateKPIInput): Promise<KPI> {
    // Calculate trend percentage if not provided
    if (!createKpiDto.trendPercentage && createKpiDto.previous) {
      const trendPercentage = this.calculateTrendPercentage(
        createKpiDto.current,
        createKpiDto.previous,
      );
      createKpiDto.trendPercentage = trendPercentage;
    }

    return this.analyticsRepository.createKPI(createKpiDto);
  }

  async findKPIById(id: string): Promise<KPI> {
    const kpi = await this.analyticsRepository.findKPIById(id);
    if (!kpi) {
      throw new NotFoundException(`KPI with ID ${id} not found`);
    }
    return kpi;
  }

  async findKPIsByCampaign(campaignId: string): Promise<KPI[]> {
    return this.analyticsRepository.findKPIsByCampaign(campaignId);
  }

  async findKPIsByTenant(tenantId: string): Promise<KPI[]> {
    return this.analyticsRepository.findKPIsByTenant(tenantId);
  }

  async updateKPI(id: string, updateData: any): Promise<KPI> {
    await this.findKPIById(id); // Ensure KPI exists

    // Recalculate trend if current value changed
    if (updateData.current) {
      const existingKPI = await this.findKPIById(id);
      const trendPercentage = this.calculateTrendPercentage(
        updateData.current,
        existingKPI.previous,
      );
      updateData.trendPercentage = trendPercentage;
    }

    return this.analyticsRepository.updateKPI(id, updateData);
  }

  // Analytics Operations
  async createAnalytics(analyticsData: any): Promise<Analytics> {
    // Calculate derived metrics
    const calculatedAnalytics = this.calculateDerivedMetrics(analyticsData);
    return this.analyticsRepository.createAnalytics(calculatedAnalytics);
  }

  async findAnalyticsById(id: string): Promise<Analytics> {
    const analytics = await this.analyticsRepository.findAnalyticsById(id);
    if (!analytics) {
      throw new NotFoundException(`Analytics with ID ${id} not found`);
    }
    return analytics;
  }

  async findAnalyticsByCampaign(campaignId: string): Promise<Analytics[]> {
    return this.analyticsRepository.findAnalyticsByCampaign(campaignId);
  }

  async findAnalyticsByCampaignAndDateRange(
    campaignId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Analytics[]> {
    return this.analyticsRepository.findAnalyticsByCampaignAndDateRange(
      campaignId,
      startDate,
      endDate,
    );
  }

  async findLatestAnalyticsByCampaign(campaignId: string): Promise<Analytics> {
    return this.analyticsRepository.findLatestAnalyticsByCampaign(campaignId);
  }

  // Aggregation Operations
  async getCampaignPerformanceSummary(campaignId: string) {
    return this.analyticsRepository.getCampaignPerformanceSummary(campaignId);
  }

  async getKPIPerformanceTrends(tenantId: string) {
    return this.analyticsRepository.getKPIPerformanceTrends(tenantId);
  }

  async getTopPerformingCampaigns(tenantId: string, limit = 10) {
    return this.analyticsRepository.getTopPerformingCampaigns(tenantId, limit);
  }

  /**
   * Calculate trend percentage between current and previous values
   * Demonstrates business logic encapsulation
   */
  private calculateTrendPercentage(current: number, previous: number): number {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Calculate derived metrics from raw analytics data
   * Demonstrates data transformation logic
   */
  private calculateDerivedMetrics(analyticsData: any): any {
    const { impressions, clicks, spend, revenue } = analyticsData;

    const calculatedData = { ...analyticsData };

    // Calculate CTR (Click-Through Rate)
    if (impressions && clicks) {
      calculatedData.ctr = (clicks / impressions) * 100;
    }

    // Calculate CPC (Cost Per Click)
    if (spend && clicks) {
      calculatedData.cpc = spend / clicks;
    }

    // Calculate CPM (Cost Per Mille)
    if (spend && impressions) {
      calculatedData.cpm = (spend / impressions) * 1000;
    }

    // Calculate ROI (Return on Investment)
    if (revenue && spend) {
      calculatedData.roi = ((revenue - spend) / spend) * 100;
    }

    return calculatedData;
  }
}
