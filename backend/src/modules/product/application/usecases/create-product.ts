import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserId } from "../../../user/domain/user.value-objects";
import { IUserRepository } from "../../../user/repositories/user.repository.interface";
import { Product } from "../../domain/product.entity";
import {
  type CreateProductInput,
  type ProductResponseDto,
  mapToProductPrimitive,
} from "../../presentation/product.dto";
import { IProductRepository } from "../../repositories/product.repository.interfaces";

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
    @Inject("IProductRepository") private readonly productRepository: IProductRepository,
  ) {}

  async execute(sellerId: string, dto: CreateProductInput): Promise<ProductResponseDto> {
    // 1. ユーザーの取得
    const user = await this.userRepository.findById(new UserId(sellerId));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 2. 商品の作成
    const product = new Product({
      title: dto.title,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      condition: dto.condition,
      sellerId: sellerId,
    });

    // 3. 更新されたユーザーを保存
    const productResponse = await this.productRepository.create(new UserId(sellerId), product);
    return mapToProductPrimitive(productResponse);
  }
}
