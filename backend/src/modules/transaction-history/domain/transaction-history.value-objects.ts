export class HistoryId {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) throw new Error("Transaction History ID cannot be empty");
  }

  isValid(value: string): boolean {
    return /^[a-zA-Z0-9-]{8,}$/.test(value);
  }

  getValue(): string {
    return this.value;
  }
}

export enum EnumTransactionType {
  PURCHASE = "purchase",
  SALE = "sale",
}
