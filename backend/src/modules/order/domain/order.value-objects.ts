export class OrderId {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) throw new Error("Order ID cannot be empty");
  }

  isValid(value: string): boolean {
    return /^[a-zA-Z0-9-]{8,}$/.test(value);
  }

  getValue(): string {
    return this.value;
  }
}

export enum EnumOrderStatus {
  CREATED = "created",
  PAID = "paid",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
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
