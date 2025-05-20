import { gql } from "@apollo/client";

// ユーザープロフィールを取得するクエリ
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      nickname
      avatarUrl
      bio
    }
  }
`;

// プロフィール更新用のミューテーション
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      nickname
      avatarUrl
      bio
    }
  }
`;
