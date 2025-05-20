import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserId } from "../../../user/domain/user.value-objects";
import { IUserRepository } from "../../../user/repositories/user.repository.interface";
import { ProductId } from "../../domain/product.value-object";
import {
  ProductResponseDto,
  UpdateProductInput,
  mapToProductPrimitive,
} from "../../presentation/product.dto";
import { IProductRepository } from "../../repositories/product.repository.interfaces";

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
    @Inject("IProductRepository") private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    sellerId: string,
    productId: string,
    dto: UpdateProductInput,
  ): Promise<ProductResponseDto> {
    // 1. Get user by ID
    const user = await this.userRepository.findById(new UserId(sellerId));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 2. Get product by ID
    const product = await this.productRepository.findById(new ProductId(productId));

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    // 3. Update product
    const updatedProduct = product.update({
      title: dto.title,
      description: dto.description,
      price: dto.price,
      status: dto.status,
      category: dto.category,
      condition: dto.condition,
      images: dto?.images?.map((image) => ({
        url: image.url,
        order: image.order,
        format: image.format,
      })),
    });

    // 4. Save updated product
    const productResponse = await this.productRepository.update(
      new ProductId(productId),
      updatedProduct,
    );
    return mapToProductPrimitive(productResponse);
  }
}
