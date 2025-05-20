"use server";

import type { loginSchema } from "@/components/pages/Login/validations/login-validation";
import type { registerUserSchema } from "@/components/pages/Register/validations/register-user";
import { getClient } from "@/lib/apollo-client";
import {
  GET_CURRENT_USER,
  LOGIN_USER,
  LOGOUT_USER,
  REFRESH_TOKEN,
  REGISTER_USER,
} from "@/lib/graphql/auth";
import { cookies } from "next/headers";
import type { z } from "zod";

export const registerUser = async (formData: z.infer<typeof registerUserSchema>) => {
  // サーバー側でも再度バリデーション
  try {
    const { email, nickname, password } = formData;

    const { data, errors } = await getClient.mutate({
      mutation: REGISTER_USER,
      variables: {
        input: { email, nickname, password },
      },
    });

    if (errors) {
      return { error: errors[0].message };
    }

    if (data?.register?.accessToken) {
      // Cookieに認証トークンを保存
      const cookieStore = await cookies();
      cookieStore.set("accessToken", data.register.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1時間
      });

      // Cookieにリフレッシュトークンを保存
      cookieStore.set("refreshToken", data.register.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1週間
      });

      return {
        success: true,
        user: data.register.user,
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      // エラーが発生した場合は、Cookieを削除
      const cookieStore = await cookies();
      cookieStore.delete("accessToken");

      return { error: "Registration Failed" };
    }
  }
};

export const loginUser = async (formData: z.infer<typeof loginSchema>) => {
  try {
    const { email, password } = formData;

    const { data, errors } = await getClient.mutate({
      mutation: LOGIN_USER,
      variables: {
        input: { email, password },
      },
    });

    if (errors) {
      return { error: errors[0].message };
    }

    if (data.login.accessToken) {
      // Cookieに認証トークンを保存
      const cookieStore = await cookies();
      cookieStore.set("accessToken", data.login.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1時間
        path: "/",
      });

      // Cookieにリフレッシュトークンを保存
      cookieStore.set("refreshToken", data.login.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1週間
      });

      return {
        success: true,
        user: data.login.user,
      };
    }
  } catch (error) {
    console.error("Login error:", error);

    // エラーが発生した場合は、Cookieを削除
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");

    return { error: "Login Failed" };
  }
};

export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) {
      return null;
    }

    const { data, errors } = await getClient.query({
      query: GET_CURRENT_USER,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });

    if (errors) {
      console.error("Get current user error:", errors[0].message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    // オプション: バックエンドでログアウト処理を実行
    await getClient.mutate({
      mutation: LOGOUT_USER,
    });

    // Cookieの認証トークンを削除
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Logout error:", error);

      // エラーが発生してもCookieは削除する
      const cookieStore = await cookies();
      cookieStore.delete("accessToken");

      return { error: error.message || "ログアウト中にエラーが発生しました" };
    }
  }
};

export const refreshAccessToken = async (refreshToken: string | undefined) => {
  try {
    const { data, errors } = await getClient.mutate({
      mutation: REFRESH_TOKEN,
      variables: {
        input: { refreshToken },
      },
    });

    if (errors) {
      console.error("Refresh token error:", errors[0].message);
      return null;
    }

    const cookieStore = await cookies();

    // Cookieに新しい認証トークンを保存
    cookieStore.set("accessToken", data.refreshAccessToken.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1時間
    });

    // Cookieに新しいリフレッシュトークンを保存
    cookieStore.set("refreshToken", data.refreshAccessToken.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1週間
    });

    return data;
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
};
