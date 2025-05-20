import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../../../../infrastructures/supabase";
import { User } from "../../../user/domain/user.entities";
import { Email, Nickname } from "../../../user/domain/user.value-objects";
import { Password, Token } from "../../domain/auth.value-objects";
import { IAuthService } from "./auth.service.interface";

@Injectable()
export class SupabaseAuthService implements IAuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }
  async register(email: Email, password: Password, nickname: Nickname): Promise<User> {
    const { data, error } = await this.supabase.auth.signUp({
      email: email.getValue(),
      password: password.getValue(),
      options: {
        data: {
          nickname: nickname.getValue(),
        },
      },
    });
    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data?.user || !data?.session) {
      throw new UnauthorizedException("Registration failed");
    }

    const { user } = data;

    return new User({
      authId: user.id,
      email: user.email,
      nickname: user.user_metadata.nickname,
      avatarUrl: user.user_metadata.avatar_url,
      bio: user.user_metadata.bio,
      isActive: true,
      createdAt: new Date(user.created_at),
    });
  }
  async login(email: Email, password: Password): Promise<User> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.getValue(),
      password: password.getValue(),
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data?.user || !data?.session) {
      throw new UnauthorizedException("Login failed");
    }

    const { user } = data;

    return new User({
      authId: user.id,
      email: user.email,
      nickname: user.user_metadata.nickname,
      avatarUrl: user.user_metadata.avatar_url,
      bio: user.user_metadata.bio,
      isActive: true,
      createdAt: new Date(data.user.created_at),
    });
  }

  async logout(): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

  async resetPassword(email: Email): Promise<boolean> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email.getValue());

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async confirmPasswordReset(
    tokens: {
      accessToken: string;
      refreshToken: string;
    },
    password: Password,
  ): Promise<boolean> {
    await this.supabase.auth.setSession({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });

    const { error } = await this.supabase.auth.updateUser({
      password: password.getValue(),
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async refreshToken(token: Token): Promise<Token> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: token.getValue(),
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session) {
      throw new UnauthorizedException("Token refresh failed");
    }

    return new Token(data.session.access_token);
  }

  async validateToken(token: Token): Promise<{ authId: string; exp: number }> {
    const { data, error } = await this.supabase.auth.getUser(token.getValue());

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new UnauthorizedException("Invalid token");
    }

    const payload = jwtDecode<{
      exp: number;
      sub: string;
    }>(token.getValue());

    return {
      authId: data.user.id,
      exp: payload.exp,
    };
  }
}
