import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderId } from "../../domain/order.value-objects";
import { OrderResponse, mapToOrderPrimitive } from "../../presentation/order.dtos";
import { IOrderRepository } from "../../repositories/order.repository.interface";

@Injectable()
export class CompleteOrderUseCase {
  constructor(@Inject("IOrderRepository") private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<OrderResponse> {
    // 注文IDから注文エンティティを取得
    const order = await this.orderRepository.findById(new OrderId(orderId));

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // 注文完了処理（ドメインロジック）を実行
    order.complete();

    // 更新された注文をリポジトリに保存
    await this.orderRepository.update(order);

    return mapToOrderPrimitive(order);
  }
}
