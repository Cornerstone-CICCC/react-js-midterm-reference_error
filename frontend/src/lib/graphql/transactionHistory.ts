import { gql } from "@apollo/client";

// ユーザーの取引履歴を取得するクエリ
export const GET_USER_TRANSACTIONS = gql`
query GetDetailedTransactionHistory {
  getUserTransactionHistories{
        createdAt
        id
        orderId
        type
        userId
  }
}
`;
