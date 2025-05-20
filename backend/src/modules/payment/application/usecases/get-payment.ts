import { Inject, Injectable } from "@nestjs/common";
import { OrderId } from "../../../order/domain/order.value-objects";
import { PaymentId } from "../../domain/payment.value-object";
import { PaymentResponseDto, mapToPaymentPrimitive } from "../../presentation/payment.dto";
import { IPaymentRepository } from "../../repositories/payment.repository.interface";

@Injectable()
export class GetPaymentUseCase {
  constructor(
    @Inject("IPaymentRepository") private readonly paymentRepository: IPaymentRepository,
  ) {}

  async executeById(id: string): Promise<PaymentResponseDto | null> {
    const payment = await this.paymentRepository.findById(new PaymentId(id));
    if (!payment) return null;
    return mapToPaymentPrimitive(payment);
  }

  async executeByOrderId(orderId: string): Promise<PaymentResponseDto | null> {
    const payment = await this.paymentRepository.findByOrderId(new OrderId(orderId));

    if (!payment) return null;
    return mapToPaymentPrimitive(payment);
  }
}
