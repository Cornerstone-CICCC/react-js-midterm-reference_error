export class UserId {
  private readonly value: string;

  constructor(id: string) {
    if (!this.isValid(id)) {
      throw new Error("Invalid user ID format");
    }
    this.value = id;
  }

  private isValid(id: string): boolean {
    return /^[a-zA-Z0-9-]{8,}$/.test(id);
  }

  getValue(): string {
    return this.value;
  }
}

export class AuthId {
  private readonly value: string;

  constructor(id: string) {
    if (!this.isValid(id)) {
      throw new Error("Invalid auth ID format");
    }
    this.value = id;
  }

  private isValid(id: string): boolean {
    return /^[a-zA-Z0-9-]{8,}$/.test(id);
  }

  getValue(): string {
    return this.value;
  }

  equals(authId: AuthId): boolean {
    return this.value === authId.value;
  }
}

export class Email {
  private readonly value: string;

  constructor(email: string | undefined) {
    if (email === undefined) {
      throw new Error("Email cannot be undefined");
    }
    if (!this.isValid(email)) {
      throw new Error("Invalid email format");
    }
    this.value = email;
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(email: Email): boolean {
    return this.value === email.value;
  }
}

export class Nickname {
  private readonly value: string;

  constructor(nickname: string) {
    if (!this.isValid(nickname)) {
      throw new Error(
        "Nickname must be 3-20 characters and contain only letters, numbers and underscores",
      );
    }
    this.value = nickname;
  }

  private isValid(nickname: string): boolean {
    return /^[a-zA-Z0-9_]{3,20}$/.test(nickname);
  }

  getValue(): string {
    return this.value;
  }
}

export class AvatarUrl {
  private readonly value: string | undefined;

  constructor(avatarUrl: string | null | undefined) {
    this.value = avatarUrl === null ? undefined : avatarUrl;
  }

  isValidUrl(url: string): boolean {
    // TODO: URLのバリデーションを強化する + SupabaseのURLに特化させる
    // SupabaseのURL形式を正規表現でチェック
    // 例: https://your-project.supabase.co/storage/v1/object/public/bucket-name/file-path
    // 例: https://your-project.supabase.co/storage/v1/object/authenticated/bucket-name/file-path
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)" + // プロトコル（http または https）
        "([a-z0-9\\-]+\\.supabase\\.co)" + // Supabaseプロジェクトドメイン
        "(\\/storage\\/v1\\/object)" + // Storageパスの基本部分
        "(\\/public\\/|\\/authenticated\\/)" + // アクセスタイプ
        "([a-zA-Z0-9\\-_.]+)" + // バケット名
        "(\\/[a-zA-Z0-9\\-_.\\/%]+)?" + // ファイルパス（オプショナル）
        "(\\?[a-zA-Z0-9\\-_.=&%]+)?" + // クエリパラメータ（オプショナル）
        "$",
    );
    return !!urlPattern.test(url);
  }

  isEmpty(): boolean {
    return this.value === undefined || this.value === null;
  }

  getValue(): string | undefined {
    return this.value;
  }
}

export class Bio {
  private readonly value: string | undefined;

  constructor(bio: string | null | undefined) {
    if (bio && !this.isValid(bio)) {
      throw new Error("Bio must be 0-500 characters long");
    }
    this.value = bio === null ? undefined : bio;
  }

  private isValid(bio: string): boolean {
    return bio.length <= 500;
  }

  getValue(): string | undefined {
    return this.value;
  }
}
