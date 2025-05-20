import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { LoginUserUseCase } from "../application/usecases/login-user";
import { LogoutUseCase } from "../application/usecases/logout";
import { RefreshTokenUseCase } from "../application/usecases/refleshToken";
import { RegisterUserUseCase } from "../application/usecases/register-user";
import { LoginInput } from "./graphql/inputs/login-user.input";
import { RefreshTokenInput } from "./graphql/inputs/reflesh-token.input";
import { RegisterInput } from "./graphql/inputs/register-user.input";
import { AuthResponse, RefreshTokenResponse } from "./graphql/responses/auth-response";

@Resolver("Auth")
export class AuthResolver {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly tokenService: RefreshTokenUseCase,
  ) {}

  @Mutation(() => AuthResponse)
  async register(@Args("input") input: RegisterInput): Promise<AuthResponse> {
    return this.registerUseCase.execute(input);
  }

  @Mutation(() => AuthResponse)
  async login(@Args("input") input: LoginInput): Promise<AuthResponse> {
    const response = await this.loginUseCase.execute(input);
    return response;
  }

  @Mutation(() => Boolean)
  async logout(): Promise<boolean> {
    return this.logoutUseCase.execute();
  }

  // リフレッシュトークン用のミューテーション
  @Mutation(() => RefreshTokenResponse)
  async refreshAccessToken(@Args("input") input: RefreshTokenInput): Promise<RefreshTokenResponse> {
    // リフレッシュトークンの検証
    const response = this.tokenService.execute({
      refreshToken: input.refreshToken,
    });

    return response;
  }
}
