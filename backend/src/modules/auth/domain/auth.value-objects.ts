export class Token {
  private readonly value: string;

  constructor(token: string) {
    if (!token || token.trim() === "") {
      throw new Error("Token cannot be empty");
    }
    this.value = token;
  }

  getValue(): string {
    return this.value;
  }
}
export class AuthId {
  private readonly value: string;

  constructor(authId: string) {
    if (!authId || authId.trim() === "") {
      throw new Error("AuthId cannot be empty");
    }
    this.value = authId;
  }

  getValue(): string {
    return this.value;
  }
}

export class Password {
  private readonly value: string;

  constructor(password: string) {
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    this.value = password;
  }

  getValue(): string {
    return this.value;
  }
}
