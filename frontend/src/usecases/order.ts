import { getClient } from "@/lib/apollo-client";
import { PURCHASE_PRODUCT } from "@/lib/graphql/order";

export const purchaseProduct = async (id: string) => {
  try {
    const client = getClient;
    const { data, errors } = await client.mutate({
      mutation: PURCHASE_PRODUCT,
      variables: {
        input: {
          productId: id,
          paymentMethod: "CREDIT_CARD", // TODO: Implement payment method selection
        },
      },
    });

    if (errors) {
      console.error("Get product detail error:", errors[0].message);
      return null;
    }

    return {
      product: data.purchaseProduct,
      success: true,
    };
  } catch (error) {
    console.error("Get product detail error:", error);
    return null;
  }
};
