import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// バックエンドのGraphQL APIのURL
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:3000/api/graphql",
});

// 認証ヘッダーを追加するためのリンク
const authLink = setContext((_, { headers }) => {
  // クライアントサイドの場合のみ、ローカルストレージからトークンを取得
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Apollo Clientのインスタンスを作成
export const getClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
