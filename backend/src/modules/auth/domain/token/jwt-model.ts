export interface JwtPayload {
  sub: string; // ユーザーID
  email?: string;
  role?: string;
  exp: number; // 有効期限
  aud?: string | string[]; // 対象者
}
