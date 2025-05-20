import { OrderId } from "../../order/domain/order.value-objects";
import { EnumPaymentMethod, EnumPaymentStatus, Money, PaymentId } from "./payment.value-object";

export class Payment {
  private readonly _id?: PaymentId;
  private readonly _orderId: OrderId;
  private readonly _amount: Money;
  private readonly _fee: Money;
  private readonly _method: EnumPaymentMethod;
  private _status: EnumPaymentStatus;
  private readonly _createdAt: Date;
  private _processedAt?: Date;
  private _releasedAt?: Date;

  constructor(props: {
    id?: string;
    orderId: string;
    amount: number;
    fee?: number;
    method: EnumPaymentMethod;
    status?: EnumPaymentStatus;
    createdAt?: Date;
    processedAt?: Date;
    releasedAt?: Date;
  }) {
    this._id = props.id ? new PaymentId(props.id) : undefined;
    this._orderId = new OrderId(props.orderId);
    this._amount = new Money(props.amount);
    this._fee = new Money(props.fee || props.amount * 0.1); // デフォルトは10%の手数料
    this._method = props.method;
    this._status = props.status || EnumPaymentStatus.PENDING;
    this._createdAt = props.createdAt || new Date();
    this._processedAt = props.processedAt;
    this._releasedAt = props.releasedAt;
  }

  // ゲッター
  get id(): PaymentId | undefined {
    return this._id;
  }
  get orderId(): OrderId {
    return this._orderId;
  }
  get amount(): Money {
    return this._amount;
  }
  get fee(): Money {
    return this._fee;
  }
  get method(): EnumPaymentMethod {
    return this._method;
  }
  get status(): EnumPaymentStatus {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get processedAt(): Date | undefined {
    return this._processedAt;
  }
  get releasedAt(): Date | undefined {
    return this._releasedAt;
  }

  hasId(): boolean {
    return this._id !== undefined;
  }

  // ビジネスロジック
  process(): void {
    if (this._status !== EnumPaymentStatus.PENDING) {
      throw new Error("Payment can only be processed when pending");
    }
    this._status = EnumPaymentStatus.PROCESSED;
    this._processedAt = new Date();
  }

  release(): void {
    if (this._status !== EnumPaymentStatus.PROCESSED) {
      throw new Error("Payment can only be released when processed");
    }
    this._status = EnumPaymentStatus.RELEASED;
    this._releasedAt = new Date();
  }

  fail(): void {
    if (this._status !== EnumPaymentStatus.PENDING) {
      throw new Error("Only pending payments can be marked as failed");
    }
    this._status = EnumPaymentStatus.FAILED;
  }

  refund(): void {
    if (
      this._status !== EnumPaymentStatus.PROCESSED &&
      this._status !== EnumPaymentStatus.RELEASED
    ) {
      throw new Error("Only processed or released payments can be refunded");
    }
    this._status = EnumPaymentStatus.REFUNDED;
  }
}
