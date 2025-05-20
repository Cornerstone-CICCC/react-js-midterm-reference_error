import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../../auth/presentation/current-user.decorators";
import { AuthGuard } from "../../auth/presentation/jwt-auth.guard";
import { DeactivateUserUseCase } from "../application/usecases/deactivate-user";
import { GetUserUseCase } from "../application/usecases/get-user";
import { UpdateProfileUseCase } from "../application/usecases/update-profile";
import { User } from "../domain/user.entities";
import { UserId } from "../domain/user.value-objects";
import { UpdateProfileInput, UserResponseDto } from "./user.dtos";

@Resolver("User")
export class UserResolver {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
  ) {}

  @Query(() => UserResponseDto)
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: User): Promise<UserResponseDto> {
    if (!user.id) {
      throw new Error("User ID is required");
    }
    const currentUser = await this.getUserUseCase.execute(user.id);
    return currentUser;
  }

  @Query(() => UserResponseDto)
  //   @UseGuards(JwtAuthGuard)
  async getUser(@Args("id") id: string): Promise<UserResponseDto> {
    const userId = new UserId(id);
    return await this.getUserUseCase.execute(userId);
  }

  @Mutation(() => UserResponseDto)
  //   @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() currentUser: User,
    @Args("input") input: UpdateProfileInput,
  ): Promise<UserResponseDto> {
    if (!currentUser.id) {
      throw new Error("User ID is required");
    }
    const updatedUser = await this.updateProfileUseCase.execute(currentUser.id, {
      nickname: input.nickname,
      avatarUrl: input.avatarUrl,
      bio: input.bio,
    });

    return updatedUser;
  }

  @Mutation(() => Boolean)
  //   @UseGuards(JwtAuthGuard)
  async deactivateMe(@CurrentUser() currentUser: User): Promise<boolean> {
    if (!currentUser.id) {
      throw new Error("User ID is required");
    }
    return this.deactivateUserUseCase.execute(currentUser.id);
  }
}
