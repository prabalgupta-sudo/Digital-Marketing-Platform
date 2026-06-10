import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsEnum, IsString, IsOptional, IsArray, IsDate } from 'class-validator';
import { KPIMetric, KPITrend } from '../entities/kpi.entity';

@InputType()
export class KPIHistoryInput {
  @Field()
  @IsDate()
  date: Date;

  @Field()
  @IsNumber()
  value: number;
}

@InputType()
export class ChannelBreakdownInput {
  @Field()
  @IsString()
  channelType: string;

  @Field()
  @IsNumber()
  value: number;
}

@InputType()
export class CreateKPIInput {
  @Field(() => String)
  @IsString()
  campaignId: string;

  @Field(() => String)
  @IsString()
  tenantId: string;

  @Field(() => KPIMetric)
  @IsEnum(KPIMetric)
  metricType: KPIMetric;

  @Field()
  @IsNumber()
  target: number;

  @Field()
  @IsNumber()
  current: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  previous?: number;

  @Field(() => KPITrend)
  @IsEnum(KPITrend)
  trend: KPITrend;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  trendPercentage?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  unit?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  frequency?: string;

  @Field(() => [KPIHistoryInput], { nullable: true })
  @IsOptional()
  @IsArray()
  history?: KPIHistoryInput[];

  @Field(() => [ChannelBreakdownInput], { nullable: true })
  @IsOptional()
  @IsArray()
  channelBreakdown?: ChannelBreakdownInput[];
}
