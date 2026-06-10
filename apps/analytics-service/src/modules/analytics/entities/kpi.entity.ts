import { Field, ID, ObjectType, Directive, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum KPIMetric {
  IMPRESSIONS = 'IMPRESSIONS',
  CLICKS = 'CLICKS',
  CONVERSIONS = 'CONVERSIONS',
  REVENUE = 'REVENUE',
  ROI = 'ROI',
  CTR = 'CTR',
  CPC = 'CPC',
  CPM = 'CPM',
  ENGAGEMENT_RATE = 'ENGAGEMENT_RATE',
}

export enum KPITrend {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
  VOLATILE = 'VOLATILE',
}

registerEnumType(KPIMetric, {
  name: 'KPIMetric',
  description: 'Available KPI metric types',
});

registerEnumType(KPITrend, {
  name: 'KPITrend',
  description: 'KPI trend indicators',
});

@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ timestamps: true })
export class KPI {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ required: true })
  campaignId: string;

  @Field()
  @Prop({ required: true })
  tenantId: string;

  @Field(() => KPIMetric)
  @Prop({ required: true, enum: KPIMetric })
  metricType: KPIMetric;

  @Field()
  @Prop({ required: true, type: Number })
  target: number;

  @Field()
  @Prop({ required: true, type: Number })
  current: number;

  @Field()
  @Prop({ type: Number })
  previous: number;

  @Field(() => KPITrend)
  @Prop({ required: true, enum: KPITrend, default: KPITrend.STABLE })
  trend: KPITrend;

  @Field()
  @Prop({ type: Number })
  trendPercentage: number;

  @Field()
  @Prop({ default: 'count' })
  unit: string;

  @Field()
  @Prop({ default: 'DAILY' })
  frequency: string;

  @Field(() => [KPIHistory])
  @Prop({ type: [Object], default: [] })
  history: KPIHistory[];

  @Field(() => [ChannelBreakdown])
  @Prop({ type: [Object], default: [] })
  channelBreakdown: ChannelBreakdown[];

  @Field()
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  updatedAt: Date;
}

@ObjectType()
export class KPIHistory {
  @Field()
  date: Date;

  @Field()
  value: number;
}

@ObjectType()
export class ChannelBreakdown {
  @Field()
  channelType: string;

  @Field()
  value: number;
}

export type KPIDocument = KPI & Document;
export const KPISchema = SchemaFactory.createForClass(KPI);

// Performance indexes
KPISchema.index({ campaignId: 1, metricType: 1 });
KPISchema.index({ tenantId: 1, trend: 1, metricType: 1 });
KPISchema.index({ 'history.date': 1, campaignId: 1 });
