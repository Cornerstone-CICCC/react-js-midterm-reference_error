import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Password } from "../../../auth/domain/auth.value-objects";
import { User } from "../../../user/domain/user.entities";
import { Email } from "../../../user/domain/user.value-objects";
import { IUserRepository } from "../../../user/repositories/user.repository.interface";
import { ITokenService } from "../../domain/token/token.service.interface";
import { IAuthService } from "../../infrastructure/supabase/auth.service.interface";
import { LoginUserUseCase } from "../usecases/login-user";

describe("LoginUseCase", () => {
  let loginUseCase: LoginUserUseCase;
  let authService: jest.Mocked<IAuthService>;
  let userRepository: jest.Mocked<IUserRepository>;
  let tokenService: jest.Mocked<ITokenService>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Create mocks
    const authServiceMock = {
      login: jest.fn(),
    };

    const userRepositoryMock = {
      findByAuthId: jest.fn(),
    };

    const tokenServiceMock = {
      createAccessToken: jest.fn(),
      createRefreshToken: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginUserUseCase,
        { provide: "IAuthService", useValue: authServiceMock },
        { provide: "IUserRepository", useValue: userRepositoryMock },
        {
          provide: "ITokenService",
          useValue: tokenServiceMock,
        },
      ],
    }).compile();

    loginUseCase = moduleRef.get<LoginUserUseCase>(LoginUserUseCase);
    authService = moduleRef.get("IAuthService") as jest.Mocked<IAuthService>;
    userRepository = moduleRef.get("IUserRepository") as jest.Mocked<IUserRepository>;
    tokenService = moduleRef.get("ITokenService") as jest.Mocked<ITokenService>;
  });

  it("should login a user successfully", async () => {
    // prepare input and mock return values
    const input = {
      email: "test@example.com",
      password: "Password123",
    };

    const loginResult = new User({
      id: "user-123456",
      authId: "auth-123",
      email: input.email,
      nickname: "testuser",
      avatarUrl: undefined,
      bio: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    authService.login.mockResolvedValue(loginResult);
    // mock user repository to return a user
    userRepository.findByAuthId.mockResolvedValue(
      new User({
        id: "user-123456",
        authId: "auth-123",
        email: input.email,
        nickname: "testuser",
        avatarUrl: undefined,
        bio: undefined,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const accessToken = "test-access-token";
    const refreshToken = "test-refresh-token";

    // mock token service to return tokens
    tokenService.createAccessToken.mockReturnValue(accessToken);
    tokenService.createRefreshToken.mockReturnValue(refreshToken);

    // Execution
    const result = await loginUseCase.execute(input);

    // Assertion
    expect(authService.login).toHaveBeenCalledWith(
      new Email(input.email),
      new Password(input.password),
    );
    expect(userRepository.findByAuthId).toHaveBeenCalledWith(loginResult.authId);
    expect(tokenService.createAccessToken).toHaveBeenCalledWith(loginResult);
    expect(tokenService.createRefreshToken).toHaveBeenCalledWith(loginResult.id?.getValue());
    expect(result).toEqual({
      accessToken,
      refreshToken,
      user: expect.objectContaining({
        email: input.email,
      }),
    });
  });

  it("should throw an error when auth service fails", async () => {
    // prepare input and mock return values
    const input = {
      email: "test@example.com",
      password: "Password123",
    };

    authService.login.mockRejectedValue(new UnauthorizedException("Login failed"));

    // Execution and verification
    await expect(loginUseCase.execute(input)).rejects.toThrow(UnauthorizedException);
  });
});
