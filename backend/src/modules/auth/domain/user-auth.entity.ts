export class TokenData {
  constructor(
    private readonly authId: string,
    private readonly exp: string,
  ) {}

  getAuthId(): string {
    return this.authId;
  }

  getExp(): string {
    return this.exp;
  }
}
