import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateCampaignDto {
  @Field()
  name: string;

  @Field()
  client: string;

  @Field(() => Float)
  budget: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}
