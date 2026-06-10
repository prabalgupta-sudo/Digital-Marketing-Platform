import { Injectable } from '@nestjs/common';
import { Recommendation, RecommendationType, RecommendationPriority, RecommendationStatus } from '../entities/recommendation.entity';
import { RecommendationRepository } from '../repositories/recommendation.repository';

/**
 * AIRecommendationService - AI-Powered Recommendation Engine
 * Implements machine learning-inspired algorithms for campaign optimization
 * 
 * Features:
 * - Budget Optimization
 * - Channel Performance Analysis
 * - ROI Prediction
 * - Trend Analysis
 * - Anomaly Detection
 */
@Injectable()
export class AIRecommendationService {
  constructor(private readonly recommendationRepository: RecommendationRepository) {}

  /**
   * Generate budget optimization recommendations
   * Uses historical performance data to suggest budget reallocations
   */
  async generateBudgetRecommendations(campaignId: string, analytics: any): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Analyze channel performance
    const channelPerformance = this.analyzeChannelPerformance(analytics);
    
    // Identify underperforming channels
    const underperformers = channelPerformance.filter(
      (ch) => ch.roi < this.calculateAverageROI(channelPerformance) * 0.8
    );

    // Identify overperforming channels
    const overperformers = channelPerformance.filter(
      (ch) => ch.roi > this.calculateAverageROI(channelPerformance) * 1.2
    );

    // Generate reallocation recommendations
    if (underperformers.length > 0 && overperformers.length > 0) {
      const topUnderperformer = underperformers[0];
      const topOverperformer = overperformers[0];

      const recommendation = await this.recommendationRepository.create({
        campaignId,
        tenantId: analytics.tenantId,
        type: RecommendationType.BUDGET_OPTIMIZATION,
        priority: this.calculatePriority(topOverperformer.roi - topUnderperformer.roi),
        title: `Reallocate budget from ${topUnderperformer.channel} to ${topOverperformer.channel}`,
        description: `Based on current performance, ${topOverperformer.channel} is showing ${topOverperformer.roi.toFixed(2)}x ROI compared to ${topUnderperformer.channel}'s ${topUnderperformer.roi.toFixed(2)}x ROI. Reallocation could improve overall campaign performance.`,
        impact: {
          estimatedROI: topOverperformer.roi * 1.1,
          confidence: this.calculateConfidence(analytics.sampleSize),
          timeframe: '30 days',
          metrics: {
            currentROI: this.calculateAverageROI(channelPerformance),
            projectedROI: topOverperformer.roi * 1.1,
            improvement: ((topOverperformer.roi * 1.1 - this.calculateAverageROI(channelPerformance)) / this.calculateAverageROI(channelPerformance)) * 100,
          },
        },
        actions: [
          {
            type: 'BUDGET_REALLOCATION',
            from: topUnderperformer.channel,
            to: topOverperformer.channel,
            amount: Math.min(topUnderperformer.budget * 0.3, topOverperformer.budget * 0.2),
          },
        ],
        generatedBy: 'AI_RECOMMENDATION_ENGINE',
        model: 'budget-optimizer-v2',
        version: '2.1.0',
        status: RecommendationStatus.PENDING_REVIEW,
      });

      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /**
   * Generate channel performance recommendations
   * Analyzes channel metrics to suggest improvements
   */
  async generateChannelRecommendations(campaignId: string, analytics: any): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Analyze click-through rates
    const ctrAnalysis = this.analyzeCTR(analytics.channels);
    
    // Identify channels with low CTR
    const lowCTRChannels = ctrAnalysis.filter((ch) => ch.ctr < 1.0);

    for (const channel of lowCTRChannels) {
      const recommendation = await this.recommendationRepository.create({
        campaignId,
        tenantId: analytics.tenantId,
        type: RecommendationType.CREATIVE_IMPROVEMENT,
        priority: channel.ctr < 0.5 ? RecommendationPriority.HIGH : RecommendationPriority.MEDIUM,
        title: `Improve creative performance for ${channel.channel}`,
        description: `${channel.channel} is showing a low CTR of ${channel.ctr.toFixed(2)}%. Consider testing new ad creatives, refining targeting, or adjusting ad placements.`,
        impact: {
          estimatedROI: channel.ctr * 1.5,
          confidence: 0.75,
          timeframe: '14 days',
          metrics: {
            currentCTR: channel.ctr,
            projectedCTR: channel.ctr * 1.5,
          },
        },
        actions: [
          {
            type: 'CREATIVE_TEST',
            amount: channel.budget * 0.1,
          },
        ],
        generatedBy: 'AI_RECOMMENDATION_ENGINE',
        model: 'creative-optimizer-v1',
        version: '1.0.0',
        status: RecommendationStatus.PENDING_REVIEW,
      });

      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /**
   * Generate timing-based recommendations
   * Analyzes performance patterns by time of day, day of week
   */
  async generateTimingRecommendations(campaignId: string, analytics: any): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Analyze temporal performance patterns
    const temporalPatterns = this.analyzeTemporalPatterns(analytics.timeSeries);
    
    // Identify optimal and suboptimal time slots
    const optimalSlots = temporalPatterns.filter((slot) => slot.performance > 1.2);
    const suboptimalSlots = temporalPatterns.filter((slot) => slot.performance < 0.8);

    if (optimalSlots.length > 0 && suboptimalSlots.length > 0) {
      const bestSlot = optimalSlots[0];
      const worstSlot = suboptimalSlots[0];

      const recommendation = await this.recommendationRepository.create({
        campaignId,
        tenantId: analytics.tenantId,
        type: RecommendationType.TIMING_ADJUSTMENT,
        priority: RecommendationPriority.MEDIUM,
        title: `Optimize ad scheduling for ${bestSlot.timeSlot}`,
        description: `Performance analysis shows that ${bestSlot.timeSlot} performs ${bestSlot.performance.toFixed(2)}x better than ${worst.timeSlot}. Consider reallocating ad spend to optimal time slots.`,
        impact: {
          estimatedROI: bestSlot.performance * 1.1,
          confidence: 0.8,
          timeframe: '7 days',
          metrics: {
            optimalTimeSlot: bestSlot.timeSlot,
            performanceImprovement: (bestSlot.performance - 1) * 100,
          },
        },
        actions: [
          {
            type: 'SCHEDULING_ADJUSTMENT',
            amount: worstSlot.spend * 0.5,
          },
        ],
        generatedBy: 'AI_RECOMMENDATION_ENGINE',
        model: 'timing-optimizer-v1',
        version: '1.0.0',
        status: RecommendationStatus.PENDING_REVIEW,
      });

      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /**
   * Generate comprehensive campaign recommendations
   * Combines multiple analysis types for holistic recommendations
   */
  async generateComprehensiveRecommendations(campaignId: string, analytics: any): Promise<Recommendation[]> {
    const allRecommendations: Recommendation[] = [];

    // Generate all types of recommendations
    const budgetRecs = await this.generateBudgetRecommendations(campaignId, analytics);
    const channelRecs = await this.generateChannelRecommendations(campaignId, analytics);
    const timingRecs = await this.generateTimingRecommendations(campaignId, analytics);

    allRecommendations.push(...budgetRecs, ...channelRecs, ...timingRecs);

    // Prioritize recommendations
    return this.prioritizeRecommendations(allRecommendations);
  }

  /**
   * Analyze channel performance metrics
   * Private helper method for performance analysis
   */
  private analyzeChannelPerformance(analytics: any): any[] {
    return analytics.channels?.map((channel: any) => ({
      channel: channel.type,
      budget: channel.budget,
      spent: channel.spent,
      impressions: channel.impressions || 0,
      clicks: channel.clicks || 0,
      conversions: channel.conversions || 0,
      roi: channel.revenue ? (channel.revenue - channel.spent) / channel.spent : 0,
      ctr: channel.impressions ? (channel.clicks / channel.impressions) * 100 : 0,
      cpc: channel.clicks ? channel.spent / channel.clicks : 0,
    })) || [];
  }

  /**
   * Calculate average ROI across channels
   */
  private calculateAverageROI(channels: any[]): number {
    if (channels.length === 0) return 0;
    const totalROI = channels.reduce((sum, ch) => sum + ch.roi, 0);
    return totalROI / channels.length;
  }

  /**
   * Calculate recommendation priority based on impact
   */
  private calculatePriority(impact: number): RecommendationPriority {
    if (impact > 0.5) return RecommendationPriority.CRITICAL;
    if (impact > 0.3) return RecommendationPriority.HIGH;
    if (impact > 0.1) return RecommendationPriority.MEDIUM;
    return RecommendationPriority.LOW;
  }

  /**
   * Calculate confidence score based on data sample size
   */
  private calculateConfidence(sampleSize: number): number {
    const minSampleSize = 100;
    const maxSampleSize = 10000;
    
    if (sampleSize < minSampleSize) return 0.5;
    if (sampleSize > maxSampleSize) return 0.95;
    
    return 0.5 + (sampleSize - minSampleSize) / (maxSampleSize - minSampleSize) * 0.45;
  }

  /**
   * Analyze click-through rates by channel
   */
  private analyzeCTR(channels: any[]): any[] {
    return channels?.map((channel: any) => ({
      channel: channel.type,
      ctr: channel.impressions ? (channel.clicks / channel.impressions) * 100 : 0,
      budget: channel.budget,
    })) || [];
  }

  /**
   * Analyze temporal performance patterns
   */
  private analyzeTemporalPatterns(timeSeries: any[]): any[] {
    // Group by time slots and calculate performance metrics
    const timeSlotPerformance = new Map<string, { impressions: number; clicks: number; spend: number }>();

    timeSeries?.forEach((data: any) => {
      const timeSlot = this.getTimeSlot(data.timestamp);
      const current = timeSlotPerformance.get(timeSlot) || { impressions: 0, clicks: 0, spend: 0 };
      
      timeSlotPerformance.set(timeSlot, {
        impressions: current.impressions + (data.impressions || 0),
        clicks: current.clicks + (data.clicks || 0),
        spend: current.spend + (data.spend || 0),
      });
    });

    // Calculate performance ratio for each time slot
    const avgPerformance = Array.from(timeSlotPerformance.values()).reduce(
      (sum, slot) => sum + (slot.impressions ? slot.clicks / slot.impressions : 0),
      0
    ) / (timeSlotPerformance.size || 1);

    return Array.from(timeSlotPerformance.entries()).map(([timeSlot, metrics]) => ({
      timeSlot,
      performance: metrics.impressions ? (metrics.clicks / metrics.impressions) / avgPerformance : 1,
      spend: metrics.spend,
    }));
  }

  /**
   * Get time slot from timestamp
   */
  private getTimeSlot(timestamp: Date): string {
    const hour = new Date(timestamp).getHours();
    if (hour >= 6 && hour < 12) return 'Morning (6-12)';
    if (hour >= 12 && hour < 18) return 'Afternoon (12-18)';
    if (hour >= 18 && hour < 24) return 'Evening (18-24)';
    return 'Night (0-6)';
  }

  /**
   * Prioritize recommendations based on impact and confidence
   */
  private prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    return recommendations.sort((a, b) => {
      const priorityScore = {
        [RecommendationPriority.CRITICAL]: 4,
        [RecommendationPriority.HIGH]: 3,
        [RecommendationPriority.MEDIUM]: 2,
        [RecommendationPriority.LOW]: 1,
      };

      const scoreA = priorityScore[a.priority] * a.impact.confidence;
      const scoreB = priorityScore[b.priority] * b.impact.confidence;

      return scoreB - scoreA;
    });
  }
}
