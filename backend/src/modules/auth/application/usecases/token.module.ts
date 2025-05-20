import { Module } from "@nestjs/common";
import { UserRepositoryModule } from "../../../user/repositories/user.repository.module";
import { TokenServiceImpl } from "../../domain/token/token.service";
import { JwtInfrastructureModule } from "../../infrastructure/jwt/jwt.module";
import { RefreshTokenUseCase } from "./refleshToken";

@Module({
  imports: [JwtInfrastructureModule, UserRepositoryModule],
  providers: [
    {
      provide: "ITokenService",
      useClass: TokenServiceImpl,
    },
    RefreshTokenUseCase,
  ],
  exports: ["ITokenService"],
})
export class TokenModule {}
