import { Field, ID, ObjectType, Directive, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ChannelType {
  GOOGLE_ADS = 'GOOGLE_ADS',
  META_FACEBOOK = 'META_FACEBOOK',
  META_INSTAGRAM = 'META_INSTAGRAM',
  TIKTOK = 'TIKTOK',
  TV = 'TV',
  PRINT = 'PRINT',
  EMAIL = 'EMAIL',
  DISPLAY = 'DISPLAY',
}

registerEnumType(CampaignStatus, {
  name: 'CampaignStatus',
  description: 'Status of a marketing campaign',
});

registerEnumType(ChannelType, {
  name: 'ChannelType',
  description: 'Available marketing channels',
});

@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ timestamps: true })
export class Campaign {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  description: string;

  @Field(() => CampaignStatus)
  @Prop({ required: true, enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Field()
  @Prop({ required: true, type: Date })
  startDate: Date;

  @Field()
  @Prop({ required: true, type: Date })
  endDate: Date;

  @Field()
  @Prop({ required: true, type: Number })
  budget: number;

  @Field()
  @Prop({ type: Number, default: 0 })
  spent: number;

  @Field(() => ID)
  @Prop({ required: true })
  ownerId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: String })
  teamId: string;

  @Field()
  @Prop({ required: true })
  tenantId: string;

  @Field(() => [Channel])
  @Prop({ type: [Object], default: [] })
  channels: Channel[];

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  tags: string[];

  @Field()
  @Prop({ default: true })
  isActive: boolean;

  @Field()
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  updatedAt: Date;
}

@ObjectType()
export class Channel {
  @Field(() => ID)
  id: string;

  @Field(() => ChannelType)
  type: ChannelType;

  @Field(() => String, { nullable: true })
  config?: string;

  @Field()
  budget: number;

  @Field()
  spent: number;
}

export type CampaignDocument = Campaign & Document;
export const CampaignSchema = SchemaFactory.createForClass(Campaign);

// Performance indexes
CampaignSchema.index({ tenantId: 1, status: 1, startDate: -1 });
CampaignSchema.index({ ownerId: 1, status: 1 });
CampaignSchema.index({ teamId: 1, status: 1 });
CampaignSchema.index({ startDate: 1, endDate: 1 });
CampaignSchema.index({ name: 'text', description: 'text', tags: 'text' }, { 
  weights: { name: 10, description: 5, tags: 3 } 
});
CampaignSchema.index({ 'channels.type': 1, status: 1 });
