import { Field, ID, ObjectType, Directive, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RecommendationType {
  BUDGET_OPTIMIZATION = 'BUDGET_OPTIMIZATION',
  CHANNEL_REALLOCATION = 'CHANNEL_REALLOCATION',
  CREATIVE_IMPROVEMENT = 'CREATIVE_IMPROVEMENT',
  AUDIENCE_TARGETING = 'AUDIENCE_TARGETING',
  TIMING_ADJUSTMENT = 'TIMING_ADJUSTMENT',
  PERFORMANCE_BOOST = 'PERFORMANCE_BOOST',
}

export enum RecommendationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum RecommendationStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  IMPLEMENTED = 'IMPLEMENTED',
  REJECTED = 'REJECTED',
}

registerEnumType(RecommendationType, {
  name: 'RecommendationType',
  description: 'Types of AI-generated recommendations',
});

registerEnumType(RecommendationPriority, {
  name: 'RecommendationPriority',
  description: 'Priority levels for recommendations',
});

registerEnumType(RecommendationStatus, {
  name: 'RecommendationStatus',
  description: 'Status of recommendation implementation',
});

@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ timestamps: true })
export class Recommendation {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ required: true })
  campaignId: string;

  @Field()
  @Prop({ required: true })
  tenantId: string;

  @Field(() => RecommendationType)
  @Prop({ required: true, enum: RecommendationType })
  type: RecommendationType;

  @Field(() => RecommendationPriority)
  @Prop({ required: true, enum: RecommendationPriority })
  priority: RecommendationPriority;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field(() => RecommendationImpact)
  @Prop({ type: Object })
  impact: RecommendationImpact;

  @Field(() => [RecommendationAction])
  @Prop({ type: [Object] })
  actions: RecommendationAction[];

  @Field()
  @Prop({ required: true })
  generatedBy: string;

  @Field()
  @Prop({ required: true })
  model: string;

  @Field()
  @Prop({ required: true })
  version: string;

  @Field(() => RecommendationStatus)
  @Prop({ required: true, enum: RecommendationStatus, default: RecommendationStatus.PENDING_REVIEW })
  status: RecommendationStatus;

  @Field(() => ID, { nullable: true })
  @Prop({ type: String })
  reviewedBy?: string;

  @Field({ nullable: true })
  @Prop({ type: Date })
  reviewedAt?: Date;

  @Field({ nullable: true })
  @Prop({ type: Date })
  implementedAt?: Date;

  @Field({ nullable: true })
  @Prop({ type: String })
  feedback?: string;

  @Field()
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  updatedAt: Date;
}

@ObjectType()
export class RecommendationImpact {
  @Field()
  estimatedROI: number;

  @Field()
  confidence: number;

  @Field()
  timeframe: string;

  @Field(() => JSON, { nullable: true })
  metrics?: Record<string, any>;
}

@ObjectType()
export class RecommendationAction {
  @Field()
  type: string;

  @Field({ nullable: true })
  from?: string;

  @Field({ nullable: true })
  to?: string;

  @Field()
  amount: number;
}

export type RecommendationDocument = Recommendation & Document;
export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);

// Performance indexes
RecommendationSchema.index({ campaignId: 1, priority: -1, status: 1 });
RecommendationSchema.index({ generatedBy: 1, model: 1 });
RecommendationSchema.index({ status: 1, priority: -1, createdAt: -1 });
RecommendationSchema.index({ tenantId: 1, status: 1 });
