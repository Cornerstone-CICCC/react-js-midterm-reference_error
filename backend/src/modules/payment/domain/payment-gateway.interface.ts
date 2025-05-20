import { EnumPaymentMethod } from "./payment.value-object";

export interface PaymentProcessResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface IPaymentGateway {
  processPayment(
    amount: number,
    method: EnumPaymentMethod,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    metadata: Record<string, any>,
  ): Promise<PaymentProcessResult>;

  refundPayment(transactionId: string): Promise<boolean>;
}
