import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshAccessToken } from "./app/actions/auth";
import { isTokenExpired } from "./utils/token";

// 認証が必要なパスのリスト
const PROTECTED_PATHS = [
  "/dashboard",
  "/settings",
  "/profile",
  "/my-items",
  "/item/create",
  "/item/edit",
  // その他の認証必須ページ
];

// 認証チェックが不要なパス（明示的に除外）
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/about",
  "/item", // 商品一覧は誰でも見られる
];

// 認証があると拡張UIを表示するが、なくても基本機能が使えるパス
const ENHANCED_PATHS = [
  "/", // トップページ
  "/item", // 商品詳細
  "/search", // 検索ページ
];

// biome-ignore lint/style/useNamingConvention: <explanation>
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 静的アセットまたはアセットディレクトリはスキップ
  // if (STATIC_ASSET_PATTERN.test(path) || path.startsWith("/assets/")) {
  //   return NextResponse.next();
  // }

  // 1. 完全に公開されたパスはスキップ
  if (PUBLIC_PATHS.some((p) => path === p)) {
    return NextResponse.next();
  }

  // アクセストークンの取得と検証
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuthenticated = accessToken && !isTokenExpired(accessToken);
  // 2. 保護されたパスのチェック - 認証が必要
  if (PROTECTED_PATHS.some((p) => path.startsWith(p))) {
    if (!isAuthenticated) {
      // リフレッシュを試みる
      const refreshToken = request.cookies.get("refreshToken")?.value;
      if (refreshToken) {
        try {
          // リフレッシュトークンでの認証更新処理
          const newToken = await refreshAccessToken(refreshToken);
          const response = NextResponse.next();
          // 新しいトークンを設定
          response.cookies.set({
            name: "accessToken",
            value: newToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          return response;
        } catch (error) {
          if (error instanceof Error) {
            // リフレッシュ失敗→ログインページへリダイレクト
            return NextResponse.redirect(new URL("/login", request.url));
          }
        }
      }
      // リフレッシュトークンがない→ログインページへリダイレクト
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // 認証OK→通常通り処理を続行
    return NextResponse.next();
  }

  // 3. 拡張UIパス - 認証状態をヘッダーに付与するが、リダイレクトしない
  if (ENHANCED_PATHS.some((p) => path.startsWith(p))) {
    const response = NextResponse.next();
    // 認証状態をヘッダーに追加（サーバーコンポーネントで利用可能）
    response.headers.set("x-auth-state", isAuthenticated ? "authenticated" : "anonymous");

    // アクセストークンが期限切れでも、リフレッシュを試みるがリダイレクトはしない
    if (!isAuthenticated) {
      const refreshToken = request.cookies.get("refreshToken")?.value;
      if (refreshToken) {
        try {
          const newToken = await refreshAccessToken(refreshToken);
          response.cookies.set({
            name: "accessToken",
            value: newToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        } catch (error) {
          // リフレッシュ失敗しても続行
          console.error("Token refresh failed", error);
        }
      }
    }
    return response;
  }

  // その他のパスはデフォルトで通す
  return NextResponse.next();
}

// config でミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    // 静的ファイルなどは除外
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
