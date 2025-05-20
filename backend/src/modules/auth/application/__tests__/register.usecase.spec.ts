import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Password } from "../../../auth/domain/auth.value-objects";
import { User } from "../../../user/domain/user.entities";
import { Email, Nickname } from "../../../user/domain/user.value-objects";
import { IUserRepository } from "../../../user/repositories/user.repository.interface";
import { ITokenService } from "../../domain/token/token.service.interface";
import { IAuthService } from "../../infrastructure/supabase/auth.service.interface";
import { RegisterUserUseCase } from "../usecases/register-user";

describe("RegisterUseCase", () => {
  let registerUseCase: RegisterUserUseCase;
  let authService: jest.Mocked<IAuthService>;
  let userRepository: jest.Mocked<IUserRepository>;
  let tokenService: jest.Mocked<ITokenService>;

  beforeEach(async () => {
    // モックの作成
    const authServiceMock = {
      register: jest.fn(),
    };

    const userRepositoryMock = {
      save: jest.fn(),
    };

    const tokenServiceMock = {
      createAccessToken: jest.fn(),
      createRefreshToken: jest.fn(),
    };

    // テストモジュールのセットアップ
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        { provide: "IAuthService", useValue: authServiceMock },
        { provide: "IUserRepository", useValue: userRepositoryMock },
        { provide: "ITokenService", useValue: tokenServiceMock },
      ],
    }).compile();

    registerUseCase = moduleRef.get<RegisterUserUseCase>(RegisterUserUseCase);
    authService = moduleRef.get("IAuthService") as jest.Mocked<IAuthService>;
    userRepository = moduleRef.get("IUserRepository") as jest.Mocked<IUserRepository>;
    tokenService = moduleRef.get("ITokenService") as jest.Mocked<ITokenService>;
  });

  it("should register a new user successfully", async () => {
    // prepare input and mock return values
    const input = {
      email: "test@example.com",
      password: "Password123",
      nickname: "testuser",
    };

    const registerResult = new User({
      id: "user-123456",
      authId: "auth-123",
      email: input.email,
      nickname: input.nickname,
      avatarUrl: undefined,
      bio: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    authService.register.mockResolvedValue(registerResult);
    userRepository.save.mockResolvedValue(registerResult);
    tokenService.createAccessToken.mockReturnValue("test-access-token");
    tokenService.createRefreshToken.mockReturnValue("test-refresh-token");
    // Mock token service

    // Execution
    const result = await registerUseCase.execute(input);

    // Assertion
    expect(authService.register).toHaveBeenCalledWith(
      new Email(input.email),
      new Password(input.password),
      new Nickname(input.nickname),
    );
    expect(tokenService.createAccessToken).toHaveBeenCalledWith(registerResult);
    expect(tokenService.createRefreshToken).toHaveBeenCalledWith(registerResult.id?.getValue());
    expect(userRepository.save).toHaveBeenCalled();
    expect(result).toEqual({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      user: expect.objectContaining({
        email: input.email,
        nickname: input.nickname,
        avatarUrl: undefined,
        bio: undefined,
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    });
  });

  it("should throw an error when auth service fails", async () => {
    // prepare input and mock return values
    const input = {
      email: "test@example.com",
      password: "Password123",
      nickname: "testuser",
    };

    authService.register.mockRejectedValue(new UnauthorizedException("Registration failed"));

    // 実行と検証
    await expect(registerUseCase.execute(input)).rejects.toThrow(UnauthorizedException);
  });
});
