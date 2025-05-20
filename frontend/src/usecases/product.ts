import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCTS, GET_PRODUCT_BY_ID } from "@/lib/graphql/product";
import type { Product } from "@/types/Product";

export const getProducts = async () => {
  try {
    const client = getClient;

    const { data, errors } = await client.query({
      query: GET_PRODUCTS,
    });

    if (errors) {
      console.error("Get products error:", errors[0].message);
      return null;
    }

    return {
      products: data.readProducts as Product[],
      success: true,
    };
  } catch (error) {
    console.error("Get products error:", error);
    return null;
  }
};

export const getProductById = async (id: string) => {
  try {
    const client = getClient;

    const { data, errors } = await client.query({
      query: GET_PRODUCT_BY_ID,
      variables: { id },
    });

    if (errors) {
      console.error("Get product detail error:", errors[0].message);
      return null;
    }

    return {
      product: data.findProductById as Product,
      success: true,
    };
  } catch (error) {
    console.error("Get product detail error:", error);
    return null;
  }
};
