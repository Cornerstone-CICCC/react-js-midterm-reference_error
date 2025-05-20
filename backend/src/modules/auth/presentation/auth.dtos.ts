export interface AuthRegisterResponseDto {
  token: string;
  authId: string;
  user?: {
    id: string;
    authId: string;
    email: string;
    nickname: string;
    avatarUrl: undefined;
    bio: undefined;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  message?: string;
}
