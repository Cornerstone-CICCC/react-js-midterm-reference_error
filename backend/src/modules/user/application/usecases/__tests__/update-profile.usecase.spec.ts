import { Test, TestingModule } from "@nestjs/testing";
import { User } from "../../../../user/domain/user.entities";
import { UserId } from "../../../../user/domain/user.value-objects";
import { UpdateProfileInput } from "../../../../user/presentation/user.dtos";
import { IUserRepository } from "../../../../user/repositories/user.repository.interface";
import { UpdateProfileUseCase } from "../update-profile";

jest.mock("../../../presentation/user.dtos.ts", () => ({
  mapToUserPrimitive: jest.fn().mockImplementation((user) => ({
    id: user.id.getValue(),
    nickname: user.nickname.getValue(),
  })),
}));

describe("UpdateProfileUseCase", () => {
  let useCase: UpdateProfileUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  // 実際のUser更新ロジックをテストするための変数
  let mockUserNickname = "oldNickname";
  let mockUpdateProfileCalled = false;
  let mockUpdateProfileArgs = null;

  beforeEach(async () => {
    mockUserNickname = "oldNickname";
    mockUpdateProfileCalled = false;
    mockUpdateProfileArgs = null;

    // 実際にプロパティが更新されるようなモックユーザーオブジェクトを作成
    const mockUser = {
      id: { getValue: jest.fn().mockReturnValue("user-123") },
      nickname: {
        getValue: jest.fn().mockImplementation(() => mockUserNickname),
        setValue: jest.fn().mockImplementation((value) => {
          mockUserNickname = value;
        }),
      },
      // updateProfileメソッドが実際にnickname値を更新するように実装
      updateProfile: jest.fn().mockImplementation((dto) => {
        mockUpdateProfileCalled = true;
        mockUpdateProfileArgs = dto;

        // 実際にnickname値を更新する実装
        if (dto.nickname) {
          mockUserNickname = dto.nickname;
        }
      }),
    } as unknown as User;

    // setup mock repository
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProfileUseCase,
        {
          provide: "IUserRepository",
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateProfileUseCase>(UpdateProfileUseCase);
    userRepository = module.get("IUserRepository");
  });

  describe("user.updateProfile(dto)", () => {
    it("should call updateProfile with the provided DTO", async () => {
      // Arrange
      const userId = { getValue: () => "user-123" } as UserId;
      const updateDto = { nickname: "newNickname" } as UpdateProfileInput;

      // Act
      await useCase.execute(userId, updateDto);

      // Assert
      expect(mockUpdateProfileCalled).toBe(true);
      expect(mockUpdateProfileArgs).toEqual(updateDto);
    });

    it("should update the user nickname to the value from the request", async () => {
      // Arrange
      const userId = { getValue: () => "user-123" } as UserId;
      const newNickname = "brandNewNickname";
      const updateDto = { nickname: newNickname } as UpdateProfileInput;

      // Check initial nickname
      expect(mockUserNickname).toBe("oldNickname");

      // Act
      await useCase.execute(userId, updateDto);

      // Assert
      expect(mockUserNickname).toBe(newNickname);
    });

    it("should pass the updated user object to repository.update", async () => {
      // Arrange
      const userId = { getValue: () => "user-123" } as UserId;
      const updateDto = { nickname: "newRepositoryNickname" } as UpdateProfileInput;

      // Act
      await useCase.execute(userId, updateDto);

      // Assert
      expect(mockUserNickname).toBe("newRepositoryNickname");

      const updatedUserPassedToRepo = userRepository.update.mock.calls[0][1];
      expect(updatedUserPassedToRepo.nickname?.getValue()).toBe("newRepositoryNickname");
    });
  });
});
