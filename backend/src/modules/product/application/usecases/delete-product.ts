import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProductId } from "../../domain/product.value-object";
import { ProductResponseDto, mapToProductPrimitive } from "../../presentation/product.dto";
import { IProductRepository } from "../../repositories/product.repository.interfaces";

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject("IProductRepository") private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string): Promise<ProductResponseDto> {
    const productResponse = await this.productRepository.delete(new ProductId(productId));
    if (!productResponse) {
      throw new NotFoundException("Failed to delete product");
    }

    return mapToProductPrimitive(productResponse);
  }
}
