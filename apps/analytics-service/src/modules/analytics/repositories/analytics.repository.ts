import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KPI, KPIDocument } from '../entities/kpi.entity';
import { Analytics, AnalyticsDocument } from '../entities/analytics.entity';
import { CreateKPIInput } from '../dto/create-kpi.input';

/**
 * AnalyticsRepository - Data Access Layer
 * Implements Repository Pattern for analytics data abstraction
 * Following Single Responsibility Principle
 */
@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectModel(KPI.name) private kpiModel: Model<KPIDocument>,
    @InjectModel(Analytics.name) private analyticsModel: Model<AnalyticsDocument>,
  ) {}

  // KPI Operations
  async createKPI(createKpiDto: CreateKPIInput): Promise<KPIDocument> {
    const createdKPI = new this.kpiModel(createKpiDto);
    return createdKPI.save();
  }

  async findKPIById(id: string): Promise<KPIDocument> {
    return this.kpiModel.findById(id).exec();
  }

  async findKPIsByCampaign(campaignId: string): Promise<KPIDocument[]> {
    return this.kpiModel.find({ campaignId }).exec();
  }

  async findKPIsByTenant(tenantId: string): Promise<KPIDocument[]> {
    return this.kpiModel.find({ tenantId }).exec();
  }

  async findKPIByCampaignAndMetric(campaignId: string, metricType: string): Promise<KPIDocument> {
    return this.kpiModel.findOne({ campaignId, metricType }).exec();
  }

  async updateKPI(id: string, updateData: any): Promise<KPIDocument> {
    return this.kpiModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // Analytics Operations
  async createAnalytics(analyticsData: any): Promise<AnalyticsDocument> {
    const createdAnalytics = new this.analyticsModel(analyticsData);
    return createdAnalytics.save();
  }

  async findAnalyticsById(id: string): Promise<AnalyticsDocument> {
    return this.analyticsModel.findById(id).exec();
  }

  async findAnalyticsByCampaign(campaignId: string): Promise<AnalyticsDocument[]> {
    return this.analyticsModel.find({ campaignId }).sort({ date: -1 }).exec();
  }

  async findAnalyticsByCampaignAndDateRange(
    campaignId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsDocument[]> {
    return this.analyticsModel
      .find({
        campaignId,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: -1 })
      .exec();
  }

  async findLatestAnalyticsByCampaign(campaignId: string): Promise<AnalyticsDocument> {
    return this.analyticsModel.findOne({ campaignId }).sort({ date: -1 }).exec();
  }

  async updateAnalytics(id: string, updateData: any): Promise<AnalyticsDocument> {
    return this.analyticsModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // Aggregation Operations
  async getCampaignPerformanceSummary(campaignId: string) {
    return this.analyticsModel.aggregate([
      { $match: { campaignId } },
      {
        $group: {
          _id: '$campaignId',
          totalImpressions: { $sum: '$impressions' },
          totalClicks: { $sum: '$clicks' },
          totalConversions: { $sum: '$conversions' },
          totalSpend: { $sum: '$spend' },
          totalRevenue: { $sum: '$revenue' },
          avgCTR: { $avg: '$ctr' },
          avgCPC: { $avg: '$cpc' },
          avgROI: { $avg: '$roi' },
        },
      },
    ]);
  }

  async getKPIPerformanceTrends(tenantId: string) {
    return this.kpiModel.aggregate([
      { $match: { tenantId } },
      {
        $addFields: {
          performanceRatio: {
            $divide: ['$current', '$target'],
          },
          isOnTrack: {
            $cond: {
              if: { $gte: [{ $divide: ['$current', '$target'] }, 0.8] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $group: {
          _id: '$campaignId',
          avgPerformanceRatio: { $avg: '$performanceRatio' },
          totalTarget: { $sum: '$target' },
          totalCurrent: { $sum: '$current' },
          onTrackKPIs: {
            $sum: { $cond: ['$isOnTrack', 1, 0] },
          },
          totalKPIs: { $sum: 1 },
        },
      },
      {
        $addFields: {
          overallOnTrackPercentage: {
            $multiply: [
              { $divide: ['$onTrackKPIs', '$totalKPIs'] },
              100,
            ],
          },
        },
      },
    ]);
  }

  async getTopPerformingCampaigns(tenantId: string, limit = 10) {
    return this.analyticsModel.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: '$campaignId',
          totalImpressions: { $sum: '$impressions' },
          totalClicks: { $sum: '$clicks' },
          totalConversions: { $sum: '$conversions' },
          totalSpend: { $sum: '$spend' },
          totalRevenue: { $sum: '$revenue' },
          avgROI: { $avg: '$roi' },
        },
      },
      {
        $addFields: {
          roi: {
            $cond: {
              if: { $eq: ['$totalSpend', 0] },
              then: 0,
              else: {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$totalRevenue', '$totalSpend'] },
                      '$totalSpend',
                    ],
                  },
                  100,
                ],
              },
            },
          },
        },
      },
      { $sort: { roi: -1 } },
      { $limit: limit },
    ]);
  }
}
