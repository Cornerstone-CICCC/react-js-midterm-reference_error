import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString, IsUrl } from "class-validator";
import { User } from "../domain/user.entities";

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nickname?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class deactivateUserInput {
  @Field()
  @IsString()
  id: string;
}

@ObjectType()
export class UserResponseDto {
  @Field()
  id: string;

  @Field()
  authId: string;

  @Field()
  email: string;

  @Field()
  nickname: string;

  @Field()
  avatarUrl?: string;

  @Field()
  bio?: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const mapToUserPrimitive = (user: User): UserResponseDto => {
  if (!user.id) {
    throw new Error("User ID is required");
  }
  return {
    id: user.id.getValue(),
    authId: user.authId.getValue(),
    email: user.email.getValue(),
    nickname: user.nickname.getValue(),
    avatarUrl: user.avatarUrl?.getValue() ?? undefined,
    bio: user.bio?.getValue() ?? undefined,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
