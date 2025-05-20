import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProductResponseDto, mapToProductPrimitive } from "../../presentation/product.dto";
import { IProductRepository } from "../../repositories/product.repository.interfaces";

@Injectable()
export class ReadProductUseCase {
  constructor(
    @Inject("IProductRepository") private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<ProductResponseDto[]> {
    // 1. 商品の取得
    const products = await this.productRepository.read();

    if (!products) {
      throw new NotFoundException("No products found in this category");
    }

    return products.map((product) => mapToProductPrimitive(product));
  }
}
