import { UserId } from "../../user/domain/user.value-objects";
import { Product } from "../domain/product.entity";
import {
  Category,
  EnumCategory,
  EnumProductStatus,
  ProductId,
} from "../domain/product.value-object";

export interface IProductRepository {
  read: () => Promise<Product[] | null>;
  findByCategory(category: Category): Promise<Product[]>;
  findById(id: ProductId): Promise<Product | undefined>;
  search(criteria: SearchCriteria): Promise<Product[] | undefined>;
  delete(id: ProductId): Promise<Product | null>;
  create(sellerId: UserId, product: Product): Promise<Product>;
  update(productId: ProductId, product: Product): Promise<Product>;
}

export interface SearchCriteria {
  title?: string;
  description?: string;
  priceRange?: { min: number; max: number };
  category?: EnumCategory;
  condition?: string;
  status?: EnumProductStatus;
  createdAtRange?: { start: Date; end: Date };
}
