import { ProductId } from "../../product/domain/product.value-object";
import { UserId } from "../../user/domain/user.value-objects";
import { EnumOrderStatus, Money, OrderId } from "./order.value-objects";

export class Order {
  private readonly _id?: OrderId;
  private readonly _productId: ProductId;
  private readonly _buyerId: UserId;
  private readonly _sellerId: UserId;
  private readonly _finalPrice: Money;
  private _status: EnumOrderStatus;
  private readonly _createdAt: Date;
  private _paidAt?: Date;
  private _completedAt?: Date;

  constructor(props: {
    id?: string;
    productId: string;
    buyerId: string;
    sellerId: string;
    finalPrice: number;
    status?: EnumOrderStatus;
    createdAt?: Date;
    paidAt?: Date | null | undefined;
    completedAt?: Date | null | undefined;
  }) {
    this._id = props.id ? new OrderId(props.id) : undefined;
    this._productId = new ProductId(props.productId);
    this._buyerId = new UserId(props.buyerId);
    this._sellerId = new UserId(props.sellerId);
    this._finalPrice = new Money(props.finalPrice);
    this._status = props.status || EnumOrderStatus.CREATED;
    this._createdAt = props.createdAt || new Date();
    this._paidAt = props.paidAt ? new Date(props.paidAt) : undefined;
    this._completedAt = props.completedAt ? new Date(props.completedAt) : undefined;
  }

  get id(): OrderId | undefined {
    return this._id;
  }

  get productId(): ProductId {
    return this._productId;
  }
  get buyerId(): UserId {
    return this._buyerId;
  }
  get sellerId(): UserId {
    return this._sellerId;
  }
  get finalPrice(): Money {
    return this._finalPrice;
  }
  get status(): EnumOrderStatus {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get paidAt(): Date | undefined {
    return this._paidAt;
  }
  get completedAt(): Date | undefined {
    return this._completedAt;
  }

  hasId(): boolean {
    return !!this._id;
  }

  pay(): void {
    if (this._status !== EnumOrderStatus.CREATED) {
      throw new Error("Order must be in CREATED status to be paid");
    }
    this._status = EnumOrderStatus.PAID;
    this._paidAt = new Date();
  }

  complete(): void {
    if (this._status !== EnumOrderStatus.PAID) {
      throw new Error("Order must be paid before completion");
    }
    this._status = EnumOrderStatus.COMPLETED;
    this._completedAt = new Date();
  }

  cancel(): void {
    if (this._status === EnumOrderStatus.COMPLETED) {
      throw new Error("Completed order cannot be cancelled");
    }
    this._status = EnumOrderStatus.CANCELLED;
  }
}
