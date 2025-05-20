import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "../../../user/domain/user.entities";
import { UserId } from "../../../user/domain/user.value-objects";
import { IUserRepository } from "../../../user/repositories/user.repository.interface";
import { JwtPayload } from "../../domain/token/jwt-model";
import { ITokenService } from "../../domain/token/token.service.interface";
import { RefreshTokenInput } from "../../presentation/graphql/inputs/reflesh-token.input";
import { RefreshTokenUseCase } from "../usecases/refleshToken";

describe("RefreshTokenUseCase", () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let tokenService: jest.Mocked<ITokenService>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");

  beforeEach(async () => {
    jest.spyOn(global, "Date").mockImplementation(() => fixedDate);
    Date.now = jest.fn(() => fixedDate.getTime());

    // Create mocks
    const userRepositoryMock = {
      findById: jest.fn(),
    };

    const tokenServiceMock = {
      validateToken: jest.fn(),
      createAccessToken: jest.fn(),
      createRefreshToken: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        RefreshTokenUseCase,
        { provide: "IUserRepository", useValue: userRepositoryMock },
        {
          provide: "ITokenService",
          useValue: tokenServiceMock,
        },
      ],
    }).compile();

    refreshTokenUseCase = moduleRef.get<RefreshTokenUseCase>(RefreshTokenUseCase);
    userRepository = moduleRef.get("IUserRepository") as jest.Mocked<IUserRepository>;
    tokenService = moduleRef.get("ITokenService") as jest.Mocked<ITokenService>;
  });

  it("should refresh tokens successfully", async () => {
    // Prepare input and mock return values
    const input: RefreshTokenInput = {
      refreshToken: "valid-refresh-token",
    };

    const userId = "user-123456";

    // Mock token validation
    const jwtPayload: JwtPayload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    tokenService.validateToken.mockReturnValue(jwtPayload);

    // Mock user repository to return a user
    const user = new User({
      id: userId,
      authId: "auth-123",
      email: "test@example.com",
      nickname: "testuser",
      avatarUrl: undefined,
      bio: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    userRepository.findById.mockResolvedValue(user);

    // Mock token generation
    const newAccessToken = "new-access-token";
    const newRefreshToken = "new-refresh-token";

    tokenService.createAccessToken.mockReturnValue(newAccessToken);
    tokenService.createRefreshToken.mockReturnValue(newRefreshToken);

    // Execution
    const result = await refreshTokenUseCase.execute(input);

    // Assertion
    expect(tokenService.validateToken).toHaveBeenCalledWith(input.refreshToken);
    expect(userRepository.findById).toHaveBeenCalledWith(expect.any(UserId));
    expect(userRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: userId }),
    );
    expect(tokenService.createAccessToken).toHaveBeenCalledWith(user);
    expect(tokenService.createRefreshToken).toHaveBeenCalledWith(userId);
    expect(result).toEqual({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  it("should throw an error when refresh token is invalid", async () => {
    // Prepare input and mock return values
    const input: RefreshTokenInput = {
      refreshToken: "invalid-refresh-token",
    };

    // Mock token service to return null for invalid token
    tokenService.validateToken.mockReturnValue(null);

    // Execution and verification
    await expect(refreshTokenUseCase.execute(input)).rejects.toThrow(UnauthorizedException);
    expect(tokenService.validateToken).toHaveBeenCalledWith(input.refreshToken);
    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it("should throw an error when token payload does not contain a subject", async () => {
    // Prepare input and mock return values
    const input: RefreshTokenInput = {
      refreshToken: "incomplete-token",
    };

    // Mock token service to return a payload without sub
    const incompletePayload: Partial<JwtPayload> = {
      exp: Math.floor(Date.now() / 1000) + 3600,
      // sub is missing
    };

    tokenService.validateToken.mockReturnValue(incompletePayload as JwtPayload);

    // Execution and verification
    await expect(refreshTokenUseCase.execute(input)).rejects.toThrow(UnauthorizedException);
    expect(tokenService.validateToken).toHaveBeenCalledWith(input.refreshToken);
    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it("should throw an error when user is not found", async () => {
    // Prepare input and mock return values
    const input: RefreshTokenInput = {
      refreshToken: "valid-token-unknown-user",
    };

    const userId = "unknown-user-id";

    // Mock token validation
    const jwtPayload: JwtPayload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    tokenService.validateToken.mockReturnValue(jwtPayload);

    // Mock user repository to return null (user not found)
    userRepository.findById.mockResolvedValue(null);

    // Execution and verification
    await expect(refreshTokenUseCase.execute(input)).rejects.toThrow(UnauthorizedException);
    expect(tokenService.validateToken).toHaveBeenCalledWith(input.refreshToken);
    expect(userRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: userId }),
    );
    expect(tokenService.createAccessToken).not.toHaveBeenCalled();
  });
});
