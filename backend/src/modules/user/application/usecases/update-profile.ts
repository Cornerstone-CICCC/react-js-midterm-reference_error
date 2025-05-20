import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserId } from "../../domain/user.value-objects";
import {
  UpdateProfileInput,
  UserResponseDto,
  mapToUserPrimitive,
} from "../../presentation/user.dtos";
import { IUserRepository } from "../../repositories/user.repository.interface";

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: UserId, dto: UpdateProfileInput): Promise<UserResponseDto> {
    // 1. ユーザーの取得
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 2. ユーザープロフィールの更新

    user.updateProfile(dto);

    // 3. 更新されたユーザーを保存
    const userResponse = await this.userRepository.update(userId, user);
    return mapToUserPrimitive(userResponse);
  }
}
