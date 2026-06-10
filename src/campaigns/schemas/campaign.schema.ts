import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Campaign {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, index: true })
  name: string;

  @Field()
  @Prop({ required: true, index: true })
  tenantId: string;

  @Field()
  @Prop({ required: true })
  client: string;

  @Field()
  @Prop({ default: 'DRAFT' })
  status: string;

  @Field()
  @Prop({ type: Number })
  budget: number;

  @Field()
  @Prop({ type: Date })
  startDate: Date;

  @Field()
  @Prop({ type: Date })
  endDate: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
// Example of MongoDB Indexing for performance
CampaignSchema.index({ client: 1, status: 1 });
CampaignSchema.index({ name: 'text' });
