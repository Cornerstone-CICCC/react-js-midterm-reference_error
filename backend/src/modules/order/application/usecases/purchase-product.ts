import { Inject, Injectable } from "@nestjs/common";
import { ProcessPaymentUseCase } from "../../../payment/application/usecases/process-payment";
import { EnumPaymentMethod } from "../../../payment/domain/payment.value-object";
import { CreatePurchaseHistoryUseCase } from "../../../transaction-history/application/usecases/create-purchase-history";
import { CreateSaleHistoryUseCase } from "../../../transaction-history/application/usecases/create-sale-history";
import { Order } from "../../domain/order.entity";
import { OrderResponse, mapToOrderPrimitive } from "../../presentation/order.dtos";
import { IOrderRepository } from "../../repositories/order.repository.interface";
import { CreateOrderUseCase } from "./create-order";

@Injectable()
export class PurchaseProductService {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    @Inject("IOrderRepository") private readonly orderRepository: IOrderRepository,
    private readonly paymentService: ProcessPaymentUseCase,
    private readonly createPurchaseHistoryUseCase: CreatePurchaseHistoryUseCase,
    private readonly createSaleHistoryUseCase: CreateSaleHistoryUseCase,
  ) {}

  // 購入フロー（商品購入→決済処理→商品状態更新→履歴追加）
  async purchaseProduct(
    productId: string,
    buyerId: string,
    paymentMethod: EnumPaymentMethod,
  ): Promise<OrderResponse> {
    // 1. まず注文を作成
    const orderResponse = await this.createOrderUseCase.execute(buyerId, productId);

    try {
      // 2. 支払い処理
      await this.paymentService.execute({
        orderId: orderResponse.id,
        amount: orderResponse.finalPrice,
        method: paymentMethod,
      });

      const order = new Order({
        id: orderResponse.id,
        productId: orderResponse.productId,
        buyerId: orderResponse.buyerId,
        sellerId: orderResponse.sellerId,
        finalPrice: orderResponse.finalPrice,
        status: orderResponse.status,
        createdAt: orderResponse.createdAt,
        paidAt: orderResponse.paidAt,
        completedAt: orderResponse.completedAt,
      });

      // 3. 注文を支払い済みに更新
      order.pay();
      await this.orderRepository.update(order);

      // 4. 注文完了処理
      order.complete();
      await this.orderRepository.update(order);

      // 5. 購入履歴と販売履歴を作成

      await this.createPurchaseHistoryUseCase.execute(orderResponse.buyerId, orderResponse.id);
      await this.createSaleHistoryUseCase.execute(orderResponse.sellerId, orderResponse.id);

      return mapToOrderPrimitive(order);
    } catch (error) {
      // 支払い失敗時はキャンセル処理
      const order = new Order(orderResponse);
      await this.orderRepository.update(order);
      throw error;
    }
  }
}
