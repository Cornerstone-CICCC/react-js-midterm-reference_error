// infrastructure/repositories/user.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { User } from "../domain/user.entities";
import { AuthId, UserId } from "../domain/user.value-objects";
import { IUserRepository } from "./user.repository.interface";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async update(id: UserId, userData: User): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: id.getValue() },
      data: {
        nickname: userData.nickname.getValue(),
        email: userData.email.getValue(),
        avatarUrl: userData.avatarUrl.getValue(),
        bio: userData.bio.getValue(),
        isActive: userData.isActive,
      },
    });

    return new User(user);
  }

  async findById(id: UserId): Promise<User | null> {
    const userId = id.getValue();
    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData) return null;

    // マッピングロジックをインライン化
    return new User(userData);
  }

  async findByAuthId(authId: AuthId): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { authId: authId.getValue() },
    });

    if (!userData) return null;

    // マッピングロジックをインライン化
    return new User(userData);
  }

  async save(user: User): Promise<User> {
    const storedUser = await this.prisma.user.create({
      data: {
        nickname: user.nickname.getValue(),
        email: user.email.getValue(),
        authId: user.authId.getValue(),
        avatarUrl: user.avatarUrl.getValue(),
        bio: user.bio.getValue(),
      },
    });

    return new User(storedUser);
  }
}
