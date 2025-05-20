import { OrderId } from "../../order/domain/order.value-objects";
import { Payment } from "../domain/payment.entity";
import { PaymentId } from "../domain/payment.value-object";

export interface IPaymentRepository {
  findById(id: PaymentId): Promise<Payment | null>;
  findByOrderId(orderId: OrderId): Promise<Payment | null>;
  save(payment: Payment): Promise<Payment | null>;
  update(payment: Payment): Promise<void>;
}
