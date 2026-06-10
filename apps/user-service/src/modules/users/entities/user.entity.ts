import { Field, ID, ObjectType, Directive } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  CAMPAIGN_MANAGER = 'CAMPAIGN_MANAGER',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER',
}

@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => UserRole)
  @Prop({ required: true, enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Field(() => ID, { nullable: true })
  @Prop({ type: String })
  teamId: string;

  @Field()
  @Prop({ required: true })
  tenantId: string;

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Field(() => UserPreferences, { nullable: true })
  @Prop({ type: Object, default: {} })
  preferences: UserPreferences;

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
export class UserPreferences {
  @Field()
  timezone: string;

  @Field()
  currency: string;

  @Field()
  language: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance
UserSchema.index({ email: 1, tenantId: 1 }, { unique: true });
UserSchema.index({ teamId: 1, isActive: 1 });
UserSchema.index({ role: 1, tenantId: 1 });
