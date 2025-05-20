// Product Types
export type Currency = "CAD" | "USD";

export type Price = {
  amount: number;
  currency: Currency;
};

export type SubCategory = {
  id: string;
  name: string;
  parentId: string;
};

export type Category = {
  id: string;
  name: string;
  subCategories: SubCategory[];
};

export type ProductImage = {
  id: string;
  url: string;
  order: number;
  format: string;
};

export type ProductCondition = "new" | "like_new" | "good" | "fair" | "poor";

export type ProductStatus = "available" | "sold" | "reserved" | "deleted";

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  status: ProductStatus;
  category: string;
  subCategory?: string;
  condition: ProductCondition;
  images: ProductImage[];
  likeCount: number;
  createdAt: string;
}
