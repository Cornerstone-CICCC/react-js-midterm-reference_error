// JWTトークンのデコード（ブラウザで実行可能）
export const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("トークンのデコードに失敗しました:", error);
    return null;
  }
};

// トークンの有効期限をチェック
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true;

    // トークンの有効期限（exp）は1970年1月1日からの秒数
    const expirationTime = decoded.exp * 1000; // ミリ秒に変換
    const currentTime = Date.now();

    // バッファ時間（例：60秒）を設定して、期限切れ直前にも更新できるようにする
    const bufferTime = 60 * 1000; // 60秒

    return currentTime > expirationTime - bufferTime;
  } catch (error) {
    console.error("トークン有効期限チェックに失敗しました:", error);
    return true; // エラーが発生した場合は期限切れとみなす
  }
};
