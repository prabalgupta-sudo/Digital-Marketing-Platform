import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recommendation, RecommendationDocument } from '../entities/recommendation.entity';

/**
 * RecommendationRepository - Data Access Layer
 * Implements Repository Pattern for recommendation data
 */
@Injectable()
export class RecommendationRepository {
  constructor(
    @InjectModel(Recommendation.name) 
    private recommendationModel: Model<RecommendationDocument>,
  ) {}

  async create(recommendationData: any): Promise<RecommendationDocument> {
    const createdRecommendation = new this.recommendationModel(recommendationData);
    return createdRecommendation.save();
  }

  async findById(id: string): Promise<RecommendationDocument> {
    return this.recommendationModel.findById(id).exec();
  }

  async findByCampaign(campaignId: string): Promise<RecommendationDocument[]> {
    return this.recommendationModel
      .find({ campaignId })
      .sort({ priority: -1, createdAt: -1 })
      .exec();
  }

  async findByTenant(tenantId: string): Promise<RecommendationDocument[]> {
    return this.recommendationModel
      .find({ tenantId })
      .sort({ priority: -1, createdAt: -1 })
      .exec();
  }

  async findByStatus(status: string, tenantId: string): Promise<RecommendationDocument[]> {
    return this.recommendationModel
      .find({ status, tenantId })
      .sort({ priority: -1, createdAt: -1 })
      .exec();
  }

  async update(id: string, updateData: any): Promise<RecommendationDocument> {
    return this.recommendationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async updateStatus(
    id: string, 
    status: string, 
    reviewedBy?: string, 
    feedback?: string
  ): Promise<RecommendationDocument> {
    const updateData: any = { status };
    
    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
      updateData.reviewedAt = new Date();
    }
    
    if (feedback) {
      updateData.feedback = feedback;
    }

    if (status === 'IMPLEMENTED') {
      updateData.implementedAt = new Date();
    }

    return this.update(id, updateData);
  }

  async findPendingRecommendations(tenantId: string): Promise<RecommendationDocument[]> {
    return this.recommendationModel
      .find({ 
        tenantId, 
        status: 'PENDING_REVIEW',
        priority: { $in: ['HIGH', 'CRITICAL'] },
      })
      .sort({ priority: -1, createdAt: -1 })
      .exec();
  }

  async getRecommendationStats(tenantId: string) {
    return this.recommendationModel.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING_REVIEW'] }, 1, 0] },
          },
          implemented: {
            $sum: { $cond: [{ $eq: ['$status', 'IMPLEMENTED'] }, 1, 0] },
          },
          avgConfidence: { $avg: '$impact.confidence' },
        },
      },
    ]);
  }
}
