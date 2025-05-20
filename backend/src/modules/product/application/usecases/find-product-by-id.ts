import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProductId } from "../../domain/product.value-object";
import { ProductResponseDto, mapToProductPrimitive } from "../../presentation/product.dto";
import { IProductRepository } from "../../repositories/product.repository.interfaces";

@Injectable()
export class FindProductByIdUseCase {
  constructor(
    @Inject("IProductRepository")
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string): Promise<ProductResponseDto> {
    // 1. 商品の取得
    const product = await this.productRepository.findById(new ProductId(productId));

    if (!product) {
      throw new NotFoundException("product not found");
    }

    return mapToProductPrimitive(product);
  }
}
