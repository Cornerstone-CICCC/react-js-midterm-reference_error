import { Inject, Injectable } from "@nestjs/common";
import { User } from "../../../user/domain/user.entities";
import { JwtService } from "../../infrastructure/jwt/jwt-auth.service.interface";
import { JwtPayload } from "./jwt-model";
import { ITokenService } from "./token.service.interface";

@Injectable()
export class TokenServiceImpl implements ITokenService {
  constructor(@Inject("JwtService") private readonly jwtService: JwtService) {}

  createAccessToken(user: User): string {
    if (!user.id) {
      throw new Error("User is required to create an access token");
    }
    const payload: Partial<JwtPayload> = {
      sub: user.id.getValue(),
      email: user.email.getValue(),
      // その他のユーザー固有のクレーム
    };

    return this.jwtService.sign(payload);
  }

  createRefreshToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: "7d" });
  }

  validateToken(token: string): JwtPayload | null {
    return this.jwtService.verify<JwtPayload>(token);
  }

  decodeToken(token: string): JwtPayload | null {
    return this.jwtService.decode<JwtPayload>(token);
  }
}
