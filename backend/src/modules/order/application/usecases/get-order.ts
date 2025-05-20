import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderId } from "../../domain/order.value-objects";
import { OrderResponse, mapToOrderPrimitive } from "../../presentation/order.dtos";
import { IOrderRepository } from "../../repositories/order.repository.interface";

@Injectable()
export class GetOrderUseCase {
  constructor(@Inject("IOrderRepository") private readonly orderRepository: IOrderRepository) {}

  async execute(userId: string, id: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(new OrderId(id));

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    // アクセス権確認
    if (order.buyerId.getValue() !== userId && order.sellerId.getValue() !== userId) {
      throw new Error("Unauthorized to access this order");
    }

    return mapToOrderPrimitive(order);
  }
}
