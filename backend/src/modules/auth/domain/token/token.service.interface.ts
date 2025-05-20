import { User } from "../../../user/domain/user.entities";
import { JwtPayload } from "./jwt-model";

export interface ITokenService {
  createAccessToken(user: User): string;
  createRefreshToken(userId: string): string;
  validateToken(token: string): JwtPayload | null;
  decodeToken(token: string): JwtPayload | null;
}
