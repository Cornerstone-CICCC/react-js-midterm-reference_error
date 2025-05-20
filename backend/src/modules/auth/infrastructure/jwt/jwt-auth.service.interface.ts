import { JwtPayload } from "../../domain/token/jwt-model";
import { JwtSignOptions } from "../supabase/auth.service.interface";

export interface JwtService {
  sign(payload: Partial<JwtPayload>, options?: JwtSignOptions): string;
  verify<T extends JwtPayload = JwtPayload>(token: string): T | null;
  decode<T extends JwtPayload = JwtPayload>(token: string): T | null;
}
