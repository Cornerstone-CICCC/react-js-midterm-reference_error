import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserId } from "../../domain/user.value-objects";
import { IUserRepository } from "../../repositories/user.repository.interface";

@Injectable()
export class DeactivateUserUseCase {
  constructor(@Inject("IUserRepository") private readonly userRepository: IUserRepository) {}

  async execute(userId: UserId): Promise<boolean> {
    // 1. Get user by ID
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 2. ユーザーを非アクティブ化
    user.deactivate();

    // 3. 更新されたユーザーを保存
    const responseUser = await this.userRepository.update(userId, user);

    if (responseUser.isActive) {
      throw new Error("Failed to deactivate user");
    }

    // 4. 成功した場合はtrueを返す
    return true;
  }
}
