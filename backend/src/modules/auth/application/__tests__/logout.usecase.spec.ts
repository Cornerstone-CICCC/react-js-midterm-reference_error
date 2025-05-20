import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { IAuthService } from "../../infrastructure/supabase/auth.service.interface";
import { LogoutUseCase } from "../usecases/logout";

describe("LogoutUseCase", () => {
  let logoutUseCase: LogoutUseCase;
  let authService: jest.Mocked<IAuthService>;

  beforeEach(async () => {
    // Create mocks
    const authServiceMock = {
      logout: jest.fn(),
    };

    const userRepositoryMock = {
      findByAuthId: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        LogoutUseCase,
        { provide: "IAuthService", useValue: authServiceMock },
        { provide: "IUserRepository", useValue: userRepositoryMock },
      ],
    }).compile();

    logoutUseCase = moduleRef.get<LogoutUseCase>(LogoutUseCase);
    authService = moduleRef.get("IAuthService") as jest.Mocked<IAuthService>;
  });

  it("should logout a user successfully", async () => {
    authService.logout.mockResolvedValue(true);

    // Execution
    const result = await logoutUseCase.execute();

    // // Assertion
    expect(authService.logout).toHaveBeenCalledWith();
    expect(result).toEqual(true);
  });

  it("should throw an error when auth service fails", async () => {
    // prepare input and mock return values

    authService.logout.mockRejectedValue(new UnauthorizedException("Login failed"));

    // Execution and verification
    await expect(logoutUseCase.execute()).rejects.toThrow(UnauthorizedException);
  });
});
