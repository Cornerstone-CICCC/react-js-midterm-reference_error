import { OrderId } from "../../order/domain/order.value-objects";
import { UserId } from "../../user/domain/user.value-objects";
import { EnumTransactionType, HistoryId } from "./transaction-history.value-objects";

export class TransactionHistory {
  private readonly _id?: HistoryId;
  private readonly _userId: UserId;
  private readonly _orderId: OrderId;
  private readonly _type: EnumTransactionType;
  private readonly _createdAt: Date;

  constructor(props: {
    id?: string;
    userId: string;
    orderId: string;
    type?: EnumTransactionType;
    createdAt?: Date;
  }) {
    this._id = props.id ? new HistoryId(props.id) : undefined;
    this._userId = new UserId(props.userId);
    this._orderId = new OrderId(props.orderId);
    this._type = props.type || EnumTransactionType.PURCHASE;
    this._createdAt = props.createdAt || new Date();
  }

  get id(): HistoryId | undefined {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get orderId(): OrderId {
    return this._orderId;
  }

  get type(): EnumTransactionType {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  hasId(): boolean {
    return !!this._id;
  }

  createPurchaseHistory(): TransactionHistory {
    return new TransactionHistory({
      userId: this._userId.getValue(),
      orderId: this._orderId.getValue(),
      type: EnumTransactionType.PURCHASE,
      createdAt: new Date(),
    });
  }

  createSaleHistory(): TransactionHistory {
    return new TransactionHistory({
      userId: this._userId.getValue(),
      orderId: this._orderId.getValue(),
      type: EnumTransactionType.SALE,
      createdAt: new Date(),
    });
  }
}
