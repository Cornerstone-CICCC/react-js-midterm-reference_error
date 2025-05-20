// modules/payment/application/commands/process-payment.command.ts
import { Inject, Injectable } from "@nestjs/common";
import { IPaymentGateway } from "../../domain/payment-gateway.interface";
import { Payment } from "../../domain/payment.entity";
import { EnumPaymentMethod, EnumPaymentStatus } from "../../domain/payment.value-object";
import { PaymentResponseDto, mapToPaymentPrimitive } from "../../presentation/payment.dto";
import { IPaymentRepository } from "../../repositories/payment.repository.interface";

export type ProcessPaymentCommand = {
  orderId: string;
  amount: number;
  method: EnumPaymentMethod;
};

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject("IPaymentRepository") private readonly paymentRepository: IPaymentRepository,
    @Inject("IPaymentGateway") private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<PaymentResponseDto> {
    // 支払いエンティティ作成
    const payment = new Payment({
      orderId: command.orderId,
      amount: command.amount,
      method: command.method,
    });

    // 支払いデータ保存（PENDING状態）
    const responsePayment = await this.paymentRepository.save(payment);

    try {
      if (!responsePayment) {
        throw new Error("Failed to save payment");
      }
      // 外部決済ゲートウェイで処理
      const result = await this.paymentGateway.processPayment(
        responsePayment.amount.getAmount(),
        responsePayment.method,
        { orderId: responsePayment.orderId },
      );

      if (result.success) {
        // 支払い成功
        responsePayment.process();
        await this.paymentRepository.update(responsePayment);
      } else {
        // 支払い失敗
        responsePayment.fail();
        await this.paymentRepository.update(responsePayment);
        throw new Error(result.error || "Payment processing failed");
      }

      return mapToPaymentPrimitive(responsePayment);
    } catch (error) {
      // エラー時にも支払い状態を更新
      if (payment.status === EnumPaymentStatus.PENDING) {
        payment.fail();
        await this.paymentRepository.update(payment);
      }
      throw error;
    }
  }
}
