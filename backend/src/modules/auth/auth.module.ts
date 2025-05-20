import { Module } from "@nestjs/common";
import { UserRepositoryModule } from "../user/repositories/user.repository.module";
import { UserModule } from "../user/user.module";
import { LoginUserUseCase } from "./application/usecases/login-user";
import { LogoutUseCase } from "./application/usecases/logout";
import { RefreshTokenUseCase } from "./application/usecases/refleshToken";
import { RegisterUserUseCase } from "./application/usecases/register-user";
import { TokenModule } from "./application/usecases/token.module";
import { TokenServiceImpl } from "./domain/token/token.service";
import { JwtInfrastructureModule } from "./infrastructure/jwt/jwt.module";
import { SupabaseAuthService } from "./infrastructure/supabase/supabase-auth.service";
import { AuthResolver } from "./presentation/auth.resolver";

@Module({
  imports: [
    UserModule,
    UserRepositoryModule,
    JwtInfrastructureModule, // JwtServiceを提供するモジュールをインポート
    TokenModule,
  ],
  providers: [
    {
      provide: "IAuthService",
      useClass: SupabaseAuthService,
    },
    {
      provide: "ITokenService",
      useClass: TokenServiceImpl,
    },
    // Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    // JWT
    // GraphQL Resolvers
    AuthResolver,
  ],
  exports: ["IAuthService"],
})
export class AuthModule {}
