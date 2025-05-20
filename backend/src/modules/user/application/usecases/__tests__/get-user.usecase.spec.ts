import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "../../../domain/user.entities";
import { UserId } from "../../../domain/user.value-objects";
import { IUserRepository } from "../../../repositories/user.repository.interface";
import { DeactivateUserUseCase } from "../deactivate-user";

describe("DeactivateUserUseCase", () => {
  let useCase: DeactivateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    // リポジトリのモックを作成
    const userRepositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    // テストモジュールの設定
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeactivateUserUseCase,
        {
          provide: "IUserRepository",
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    // テスト対象とモックを取得
    useCase = moduleRef.get<DeactivateUserUseCase>(DeactivateUserUseCase);
    userRepository = moduleRef.get("IUserRepository") as jest.Mocked<IUserRepository>;
  });

  it("should successfully deactivate a user", async () => {
    // テスト用のユーザーID
    const userId = new UserId("user-123");

    // 実際のUserインスタンスを作成
    const user = new User({
      id: "user-123",
      authId: "auth-123",
      email: "test@example.com",
      nickname: "testuser",
      avatarUrl: null,
      bio: null,
      isActive: true,
    });

    // deactivateメソッドをスパイ
    const deactivateSpy = jest.spyOn(user, "deactivate");

    // リポジトリメソッドのモック設定
    userRepository.findById.mockResolvedValue(user);

    // updateメソッドは非アクティブ化されたユーザーを返す
    userRepository.update.mockImplementation((_: UserId, updatedUser: User) => {
      // Userのインスタンスであることを確認
      expect(updatedUser).toBeInstanceOf(User);
      // 非アクティブ化されていることを確認
      expect(updatedUser.isActive).toBe(false);
      return Promise.resolve(updatedUser);
    });

    // 実行
    const result = await useCase.execute(userId);

    // 検証
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(deactivateSpy).toHaveBeenCalled();
    expect(userRepository.update).toHaveBeenCalledWith(userId, user);
    expect(result).toBe(true);
  });

  it("should throw NotFoundException when user is not found", async () => {
    // テスト用のユーザーID
    const userId = new UserId("nonexistent-user");

    // ユーザーが見つからない場合のモック
    userRepository.findById.mockResolvedValue(null);

    // 実行と検証
    await expect(useCase.execute(userId)).rejects.toThrow(NotFoundException);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it("should throw Error when deactivation fails", async () => {
    // テスト用のユーザーID
    const userId = new UserId("user-456");

    // 実際のUserインスタンスを作成
    const user = new User({
      id: "user-456",
      authId: "auth-456",
      email: "test2@example.com",
      nickname: "testuser2",
      avatarUrl: null,
      bio: null,
      isActive: true,
    });

    // リポジトリメソッドのモック設定
    userRepository.findById.mockResolvedValue(user);

    // 失敗ケース - 更新後もアクティブなままのユーザーを返す
    userRepository.update.mockResolvedValue(
      new User({
        id: "user-456",
        authId: "auth-456",
        email: "test2@example.com",
        nickname: "testuser2",
        avatarUrl: null,
        bio: null,
        isActive: true, // まだアクティブ
      }),
    );

    // 実行と検証
    await expect(useCase.execute(userId)).rejects.toThrow("Failed to deactivate user");
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.update).toHaveBeenCalledWith(userId, expect.any(User));
  });
});
