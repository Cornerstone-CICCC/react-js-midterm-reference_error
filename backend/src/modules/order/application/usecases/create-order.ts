import { HttpException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EnumProductStatus, ProductId } from "../../../product/domain/product.value-object";
import { IProductRepository } from "../../../product/repositories/product.repository.interfaces";
import { Order } from "../../domain/order.entity";
import { OrderResponse, mapToOrderPrimitive } from "../../presentation/order.dtos";
import { IOrderRepository } from "../../repositories/order.repository.interface";

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject("IOrderRepository") private readonly orderRepository: IOrderRepository,
    @Inject("IProductRepository") private readonly productRepository: IProductRepository,
  ) {}

  async execute(buyerId: string, productId: string): Promise<OrderResponse> {
    // Get product
    const product = await this.productRepository.findById(new ProductId(productId));

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (product.status.getValue() !== EnumProductStatus.AVAILABLE) {
      throw new Error("Product is not available");
    }

    // Create order
    const order = new Order({
      productId: productId,
      buyerId: buyerId,
      sellerId: product.sellerId.getValue(),
      finalPrice: product.price.getValue(),
    });

    const createdOrder = await this.orderRepository.save(order);

    if (!createdOrder) {
      throw new HttpException("Failed to create order", 422);
    }

    // Update product status
    product.soldProduct();
    this.productRepository.update(new ProductId(productId), product);

    return mapToOrderPrimitive(createdOrder);
  }
}
