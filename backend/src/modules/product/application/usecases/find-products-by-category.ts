import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Category, EnumCategory } from "../../domain/product.value-object";
import { ProductResponseDto, mapToProductPrimitive } from "../../presentation/product.dto";
import { IProductRepository } from "../../repositories/product.repository.interfaces";

@Injectable()
export class FindProductByCategoryUseCase {
  constructor(
    @Inject("IProductRepository") private readonly productRepository: IProductRepository,
  ) {}

  async execute(category: string): Promise<ProductResponseDto[]> {
    // 1. 商品の取得
    const products = await this.productRepository.findByCategory(
      new Category(category as EnumCategory),
    );

    if (!products) {
      throw new NotFoundException("No products found in this category");
    }

    return products.map((product) => mapToProductPrimitive(product));
  }
}
