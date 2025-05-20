import { User } from "src/modules/user/domain/user.entities";
import { Email, Nickname } from "../../../user/domain/user.value-objects";
import { Password, Token } from "../../domain/auth.value-objects";

export interface AuthResult {
  user?: User;
}

export interface TokenData {
  authId: string;
  exp: number;
}

export interface IAuthService {
  register(email: Email, password: Password, nickname: Nickname): Promise<User>;
  login(email: Email, password: Password): Promise<User>;
  logout(): Promise<boolean>;
  resetPassword(email: Email): Promise<boolean>;
  confirmPasswordReset(
    token: {
      accessToken: string;
      refreshToken: string;
    },
    password: Password,
  ): Promise<boolean>;
  refreshToken(token: Token): Promise<Token>;
  validateToken(token: Token): Promise<TokenData>;
}

export interface JwtSignOptions {
  expiresIn?: string | number;
  subject?: string;
  audience?: string | string[];
  issuer?: string;
  notBefore?: string | number;
}
