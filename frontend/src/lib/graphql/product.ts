import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query ReadProducts {
    readProducts {
      id
      sellerId
      title
      description
      price
      status
      category
      condition
      images {
        imageId
        url
        order
        format
      }
      likeCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    findProductById(id: $id) {
      id
      sellerId
      title
      description
      price
      status
      category
      condition
      images {
        imageId
        url
        order
        format
      }
      likeCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!) {
    findProductsByCategory(category: $category) {
      id
      sellerId
      title
      description
      price
      status
      category
      condition
      images {
        imageId
        url
        order
        format
      }
      likeCount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      sellerId
      title
      description
      price
      status
      category
      condition
      likeCount
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      sellerId
      title
      description
      price
      status
      category
      condition
      images {
        imageId
        url
        order
        format
      }
      likeCount
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id) {
      id
      sellerId
      title
      description
      price
      status
      category
      condition
      images {
        imageId
        url
        order
        format
      }
      likeCount
      createdAt
      updatedAt
    }
  }
`;

// TODO: Add Get Product By Criteria
