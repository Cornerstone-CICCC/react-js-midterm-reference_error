import { Test, TestingModule } from "@nestjs/testing";
import { LoginUserUseCase } from "../../application/usecases/login-user";
import { LogoutUseCase } from "../../application/usecases/logout";
import { RefreshTokenUseCase } from "../../application/usecases/refleshToken";
import { RegisterUserUseCase } from "../../application/usecases/register-user";
import { AuthResolver } from "../../presentation/auth.resolver";

describe("AuthResolver (Integration)", () => {
  let moduleRef: TestingModule;
  let authResolver: AuthResolver;
  let registerUseCase: RegisterUserUseCase;
  let loginUseCase: LoginUserUseCase;
  let logoutUseCase: LogoutUseCase;
  let refleshTokenUseCase: RefreshTokenUseCase;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: RegisterUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: LoginUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: LogoutUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RefreshTokenUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    // Get the instances of the classes
    authResolver = moduleRef.get<AuthResolver>(AuthResolver);
    registerUseCase = moduleRef.get<RegisterUserUseCase>(RegisterUserUseCase);
    loginUseCase = moduleRef.get<LoginUserUseCase>(LoginUserUseCase);
    logoutUseCase = moduleRef.get<LogoutUseCase>(LogoutUseCase);
    refleshTokenUseCase = moduleRef.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  // Register Test
  it("should register a user and return auth response", async () => {
    // Setup mock for registerUseCase
    const registerSpy = jest.spyOn(registerUseCase, "execute").mockResolvedValue({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      user: {
        id: "user-123",
        authId: "auth-123",
        email: "test@example.com",
        nickname: "testuser",
        avatarUrl: undefined,
        bio: undefined,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Execute the register method
    const result = await authResolver.register({
      email: "test@example.com",
      password: "Password123",
      nickname: "testuser",
    });

    // Assert the results
    expect(registerUseCase.execute).toHaveBeenCalled();
    expect(registerSpy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Password123",
      nickname: "testuser",
    });

    expect(result).toEqual({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      user: expect.objectContaining({
        email: "test@example.com",
        nickname: "testuser",
      }),
    });
  });

  // Login Test
  it("should login a user and return auth response", async () => {
    //
    const loginSpy = jest.spyOn(loginUseCase, "execute").mockResolvedValue({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      user: {
        id: "user-123",
        authId: "auth-123",
        email: "test@example.com",
        nickname: "testuser",
        avatarUrl: "test-avatar-url",
        bio: "test-bio",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Execute the login method
    const result = await authResolver.login({
      email: "test@example.com",
      password: "Password123",
    });

    // Assert the results
    expect(loginUseCase.execute).toHaveBeenCalled();
    expect(loginSpy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Password123",
    });
    expect(result).toEqual({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      user: expect.objectContaining({
        email: "test@example.com",
        nickname: "testuser",
        avatarUrl: "test-avatar-url",
        bio: "test-bio",
      }),
    });
  });

  // Logout Test
  it("should logout a user and return true", async () => {
    // Setup mock for logoutUseCase
    const logoutSpy = jest.spyOn(logoutUseCase, "execute").mockResolvedValue(true);

    // Execute the logout method
    const result = await authResolver.logout();

    // Assert the results
    expect(logoutUseCase.execute).toHaveBeenCalled();
    expect(logoutSpy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  // Refresh Token Test
  it("should refresh token and return auth response", async () => {
    // Setup mock for refreshTokenUseCase
    const refreshTokenSpy = jest.spyOn(refleshTokenUseCase, "execute").mockResolvedValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    // Execute the refreshToken method
    const result = await authResolver.refreshAccessToken({
      refreshToken: "old-refresh-token",
    });
    // Assert the results
    expect(refleshTokenUseCase.execute).toHaveBeenCalled();
    expect(refreshTokenSpy).toHaveBeenCalledWith({
      refreshToken: "old-refresh-token",
    });
    expect(result).toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
  });
});
