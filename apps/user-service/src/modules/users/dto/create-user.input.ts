import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { UserRole } from '../entities/user.entity';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Available user roles in the system',
});

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  defaultRole?: UserRole;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  teamId?: string;

  @Field(() => String)
  @IsString()
  tenantId: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @Field(() => UserPreferencesInput, { nullable: true })
  @IsOptional()
  preferences?: UserPreferencesInput;
}

@InputType()
export class UserPreferencesInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timezone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  language?: string;
}
