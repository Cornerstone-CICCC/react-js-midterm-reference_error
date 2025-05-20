export class PaymentId {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) throw new Error("Payment ID cannot be empty");
  }

  isValid(value: string): boolean {
    return /^[a-zA-Z0-9-]{8,}$/.test(value);
  }

  getValue(): string {
    return this.value;
  }
}

export enum EnumPaymentStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  RELEASED = "released",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum EnumPaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PAYPAL = "PAYPAL",
}

export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string = "USD",
  ) {
    if (amount < 0) throw new Error("Amount cannot be negative");
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }
}
