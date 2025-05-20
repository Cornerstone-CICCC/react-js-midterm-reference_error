import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthId, Email } from "../../../user/domain/user.value-objects";
import { mapToUserPrimitive } from "../../../user/presentation/user.dtos";
import { IUserRepository } from "../../../user/repositories/user.repository.interface";
import { Password } from "../../domain/auth.value-objects";
import { ITokenService } from "../../domain/token/token.service.interface";
import { IAuthService } from "../../infrastructure/supabase/auth.service.interface";
import { LoginInput } from "../../presentation/graphql/inputs/login-user.input";
import { AuthResponseDto } from "../../presentation/graphql/responses/auth-response";

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject("IAuthService") private readonly authService: IAuthService,
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
    @Inject("ITokenService") private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<AuthResponseDto> {
    // 1. Supabase Authでユーザー認証
    const authenticatedUser = await this.authService.login(
      new Email(input.email),
      new Password(input.password),
    );

    if (!authenticatedUser) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // 2. 認証IDをもとにユーザーエンティティを取得
    const user = await this.userRepository.findByAuthId(
      new AuthId(authenticatedUser?.authId.getValue()),
    );

    if (!user || !user.id) {
      throw new NotFoundException("User not found");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("User account is deactivated");
    }

    const accessToken = this.tokenService.createAccessToken(user);
    const refreshToken = this.tokenService.createRefreshToken(user.id.getValue());

    // 3. レスポンスDTOを作成して返却
    return {
      user: mapToUserPrimitive(user),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
