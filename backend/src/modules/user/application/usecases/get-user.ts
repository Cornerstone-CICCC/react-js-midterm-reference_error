import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserId } from "../../domain/user.value-objects";
import { UserResponseDto, mapToUserPrimitive } from "../../presentation/user.dtos";
import { IUserRepository } from "../../repositories/user.repository.interface";

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: UserId): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return mapToUserPrimitive(user);
  }
}
