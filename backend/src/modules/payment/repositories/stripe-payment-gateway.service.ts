// modules/payment/infrastructure/services/stripe-payment-gateway.service.ts
import { Injectable } from "@nestjs/common";
import { IPaymentGateway, PaymentProcessResult } from "../domain/payment-gateway.interface";
import { EnumPaymentMethod } from "../domain/payment.value-object";

@Injectable()
export class StripePaymentGatewayService implements IPaymentGateway {
  // 実際のStripe連携実装は省略 - ここではモック実装

  async processPayment(
    amount: number,
    method: EnumPaymentMethod,
    // metadata: Record<string, any>,
  ): Promise<PaymentProcessResult> {
    // 実装では実際のStripe APIを呼び出す
    console.info(`Processing payment: ${amount} via ${method}`);

    // テスト用に常に成功する実装
    return {
      success: true,
      transactionId: `stripe-tx-${Date.now()}`,
    };
  }

  async refundPayment(transactionId: string): Promise<boolean> {
    console.info(`Refunding payment: ${transactionId}`);
    return true;
  }
}
