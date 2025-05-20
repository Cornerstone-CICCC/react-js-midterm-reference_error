// モックするsupabaseオブジェクトとその型
const mockSupabaseAuth = {
  signUp: jest.fn(),
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
  getUser: jest.fn(),
};

jest.mock("../../../../infrastructures/supabase.ts", () => ({
  supabase: {
    auth: mockSupabaseAuth,
  },
}));

import * as path from "node:path";
import * as dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../../../../../.env.test");
dotenv.config({ path: envPath });

import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "../../../user/domain/user.entities";
import { Email, Nickname } from "../../../user/domain/user.value-objects";
import { Password } from "../../domain/auth.value-objects";
import { SupabaseAuthService } from "../supabase/supabase-auth.service";

describe("SupabaseAuthService", () => {
  let service: SupabaseAuthService;
  // supabaseモジュール全体をモック

  beforeEach(async () => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [SupabaseAuthService],
    }).compile();

    service = moduleRef.get<SupabaseAuthService>(SupabaseAuthService);
  });

  describe("register", () => {
    it("should successfully register a user", async () => {
      // モックの戻り値を設定
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: {
          user: {
            id: "user-123",
            email: "test@example.com",
            user_metadata: { nickname: "nickname", avatar_url: null, bio: null },
          },
          session: { access_token: "test-token" },
        },
        error: null,
      });

      // メソッドを実行
      const result = await service.register(
        new Email("test@example.com"),
        new Password("password"),
        new Nickname("nickname"),
      );

      // 検証
      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
        options: {
          data: { nickname: "nickname" },
        },
      });
      expect(result).toEqual(
        new User({
          authId: "user-123",
          email: "test@example.com",
          nickname: "nickname",
          avatarUrl: null,
          bio: null,
          isActive: true,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it("should throw an error when registration fails", async () => {
      // モックの戻り値を設定
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: null,
        error: { message: "Registration failed" },
      });

      // メソッドを実行し、エラーを期待する
      await expect(
        service.register(
          new Email("test@example.com"),
          new Password("password"),
          new Nickname("nickname"),
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("login", () => {
    it("should successfully login a user", async () => {
      // モックの戻り値を設定

      const mockResponse = {
        id: "user-456",
        email: "existing@example.com",
        user_metadata: {
          nickname: "existing_nickname",
          avatar_url: null,
          bio: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      };
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: {
          user: mockResponse,
          session: { access_token: "login-token" },
        },
        error: null,
      });

      // メソッドを実行
      const result = await service.login(
        new Email("existing@example.com"),
        new Password("secure-password"),
      );

      // 検証
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: "existing@example.com",
        password: "secure-password",
      });
      expect(result).toEqual(
        new User({
          authId: mockResponse.id,
          email: mockResponse.email,
          nickname: mockResponse.user_metadata.nickname,
          avatarUrl: mockResponse.user_metadata.avatar_url,
          bio: mockResponse.user_metadata.bio,
          isActive: true,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it("should throw an error when login fails with invalid credentials", async () => {
      // モックの戻り値を設定
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid login credentials" },
      });

      // メソッドを実行し、エラーを期待する
      await expect(
        service.login(new Email("wrong@example.com"), new Password("wrong-password")),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw an error when user account is not found", async () => {
      // モックの戻り値を設定
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "User not found" },
      });

      // メソッドを実行し、エラーを期待する
      await expect(
        service.login(new Email("nonexistent@example.com"), new Password("any-password")),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("logout", () => {
    it("should successfully log out a user", async () => {
      // モックの戻り値を設定
      mockSupabaseAuth.signOut.mockResolvedValue({
        error: null,
      });

      // メソッドを実行
      const result = await service.logout();

      // 検証
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
