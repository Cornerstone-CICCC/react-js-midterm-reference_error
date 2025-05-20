import { AuthId, AvatarUrl, Bio, Email, Nickname, UserId } from "./user.value-objects";

export class User {
  private readonly _id?: UserId;
  private readonly _authId: AuthId;
  private _email: Email;
  private _nickname: Nickname;
  private _avatarUrl: AvatarUrl;
  private _bio: Bio;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id?: string;
    authId: string;
    email?: string;
    nickname: string;
    avatarUrl: string | null | undefined;
    bio: string | null | undefined;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id ? new UserId(props.id) : undefined;
    this._authId = new AuthId(props.authId);
    this._email = new Email(props.email);
    this._nickname = new Nickname(props.nickname);
    this._avatarUrl = new AvatarUrl(props.avatarUrl);
    this._bio = new Bio(props.bio);
    this._isActive = props.isActive;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getter
  get id(): UserId | undefined {
    return this._id;
  }

  get authId(): AuthId {
    return this._authId;
  }

  get email(): Email {
    return this._email;
  }

  get nickname(): Nickname {
    return this._nickname;
  }

  get avatarUrl(): AvatarUrl {
    return this._avatarUrl;
  }

  get bio(): Bio {
    return this._bio;
  }
  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  hasId(): boolean {
    return !!this._id;
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new Error("User is already deactivated");
    }
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    if (this._isActive) {
      throw new Error("User is already activated");
    }
    this._isActive = true;
    this._updatedAt = new Date();
  }

  updateProfile(params: {
    nickname?: string;
    avatarUrl?: string | null;
    bio?: string | null;
  }): void {
    if (params.nickname) {
      this._nickname = new Nickname(params.nickname);
    }

    if (params.avatarUrl !== undefined) {
      this._avatarUrl = params.avatarUrl ? new AvatarUrl(params.avatarUrl) : this._avatarUrl;
    }

    if (params.bio !== undefined) {
      this._bio = params.bio ? new Bio(params.bio) : this._bio;
    }

    this._updatedAt = new Date();
  }
}

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidProfileDataError extends DomainError {
  // biome-ignore lint/complexity/noUselessConstructor: <explanation>
  constructor(message: string) {
    super(message);
  }
}
