import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber, IsDate, IsEnum, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { CampaignStatus, ChannelType } from '../entities/campaign.entity';

@InputType()
export class ChannelInput {
  @Field(() => ChannelType)
  @IsEnum(ChannelType)
  type: ChannelType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  config?: string;

  @Field()
  @IsNumber()
  budget: number;

  @Field()
  @IsNumber()
  spent: number;
}

@InputType()
export class CreateCampaignInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => CampaignStatus)
  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @Field()
  @IsDate()
  startDate: Date;

  @Field()
  @IsDate()
  endDate: Date;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  teamId?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @Field(() => [ChannelInput], { nullable: true })
  @IsOptional()
  @IsArray()
  channels?: ChannelInput[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
