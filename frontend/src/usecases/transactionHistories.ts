import { getClient } from "@/lib/apollo-client";
import { GET_USER_TRANSACTIONS } from "@/lib/graphql/transactionHistory";

export const getTransactionHistory = async () => {
  try {
    const client = getClient;
    const { data, errors } = await client.query({
      query: GET_USER_TRANSACTIONS,
    });

    if (errors) {
      console.error("Get transaction history error:", errors[0].message);
      return null;
    }

    return {
      transactionHistories: data.getUserTransactionHistories,
      success: true,
    };
  } catch (error) {
    console.error("Get transaction history error:", error);
    return null;
  }
};
