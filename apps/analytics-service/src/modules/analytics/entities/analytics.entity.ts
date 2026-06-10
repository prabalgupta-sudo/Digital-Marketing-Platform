import { Field, ID, ObjectType, Directive } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ timestamps: true })
export class Analytics {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ required: true })
  campaignId: string;

  @Field()
  @Prop({ required: true })
  tenantId: string;

  @Field()
  @Prop({ required: true, type: Number, default: 0 })
  impressions: number;

  @Field()
  @Prop({ required: true, type: Number, default: 0 })
  clicks: number;

  @Field()
  @Prop({ required: true, type: Number, default: 0 })
  conversions: number;

  @Field()
  @Prop({ required: true, type: Number, default: 0 })
  spend: number;

  @Field()
  @Prop({ type: Number })
  revenue: number;

  @Field()
  @Prop({ type: Number })
  roi: number;

  @Field()
  @Prop({ type: Number })
  ctr: number;

  @Field()
  @Prop({ type: Number })
  cpc: number;

  @Field()
  @Prop({ type: Number })
  cpm: number;

  @Field()
  @Prop({ type: Number })
  engagementRate: number;

  @Field()
  @Prop({ type: Date })
  date: Date;

  @Field()
  @Prop({ type: Object })
  breakdown: Record<string, any>;

  @Field()
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  updatedAt: Date;
}

export type AnalyticsDocument = Analytics & Document;
export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);

// Performance indexes
AnalyticsSchema.index({ campaignId: 1, date: -1 });
AnalyticsSchema.index({ tenantId: 1, date: -1 });
AnalyticsSchema.index({ campaignId: 1, tenantId: 1, date: -1 });
