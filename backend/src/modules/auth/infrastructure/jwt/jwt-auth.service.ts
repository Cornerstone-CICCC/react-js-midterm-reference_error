import { Injectable } from "@nestjs/common";
import { JwtService as NestJS_JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../../domain/token/jwt-model";
import { JwtSignOptions } from "../supabase/auth.service.interface";
import { JwtService } from "./jwt-auth.service.interface";

@Injectable()
export class NestJwtServiceAdapter implements JwtService {
  constructor(private readonly jwtService: NestJS_JwtService) {}

  sign(payload: JwtPayload, options?: JwtSignOptions): string {
    const defaultOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      secret: process.env.JWT_SECRET,
    };

    return this.jwtService.sign(payload, { ...defaultOptions, ...options });
  }

  verify<T extends JwtPayload>(token: string): T | null {
    try {
      return this.jwtService.verify<T>(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return null;
    }
  }

  decode<T extends JwtPayload>(token: string): T | null {
    try {
      return this.jwtService.decode(token) as T;
    } catch (error) {
      console.error("JWT decode failed:", error.message);
      return null;
    }
  }
}
