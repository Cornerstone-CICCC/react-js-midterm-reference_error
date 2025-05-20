import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserId } from "../../../user/domain/user.value-objects";
import { IUserRepository } from "../../../user/repositories/user.repository.interface";
import { ITokenService } from "../../domain/token/token.service.interface";
import { RefreshTokenInput } from "../../presentation/graphql/inputs/reflesh-token.input";
import { RefreshTokenResponse } from "../../presentation/graphql/responses/auth-response";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
    @Inject("ITokenService") private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenResponse> {
    // リフレッシュトークンの検証
    const payload = this.tokenService.validateToken(input.refreshToken);

    if (!payload || !payload.sub) {
      throw new UnauthorizedException("無効なリフレッシュトークンです");
    }

    const userId = payload.sub;

    // ユーザー情報の取得（必要に応じて）
    const user = await this.userRepository.findById(new UserId(userId));

    if (!user) {
      throw new UnauthorizedException("ユーザーが見つかりません");
    }

    // 新しいアクセストークンを生成
    const newAccessToken = this.tokenService.createAccessToken(user);

    // リフレッシュトークンの再生成（オプション）
    const newRefreshToken = this.tokenService.createRefreshToken(userId);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // リフレッシュトークンも更新する場合
    };
  }
}
