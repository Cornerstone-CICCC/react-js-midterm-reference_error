import { gql } from "@apollo/client";

export const PURCHASE_PRODUCT = gql`
  mutation PurchaseProduct($input: PurchaseProductInput!) {
    purchaseProduct(input: $input) {
      id
    }
  }
`;
