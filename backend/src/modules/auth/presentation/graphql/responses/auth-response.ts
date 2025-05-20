import { Field, ObjectType } from "@nestjs/graphql";
import { UserResponseDto } from "../../../../user/presentation/user.dtos";

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserResponseDto)
  user: UserResponseDto;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
