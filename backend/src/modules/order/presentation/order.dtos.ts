import { Field, Float, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { EnumPaymentMethod } from "../../payment/domain/payment.value-object";
import { Order } from "../domain/order.entity";
import { EnumOrderStatus } from "../domain/order.value-objects";

@InputType()
export class CreateOrderInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}

@InputType()
export class PurchaseProductInput {
  @Field()
  @IsUUID()
  productId: string;

  @Field()
  @IsEnum(EnumPaymentMethod)
  paymentMethod: EnumPaymentMethod;
}

@ObjectType()
export class OrderResponse {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  productId: string;

  @Field(() => ID)
  buyerId: string;

  @Field(() => ID)
  sellerId: string;

  @Field(() => Float)
  finalPrice: number;

  @Field()
  status: EnumOrderStatus;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field({ nullable: true })
  completedAt?: Date;
}

export const mapToOrderPrimitive = (order: Order): OrderResponse => {
  if (!order.id) {
    throw new Error("Order ID is not defined");
  }
  return {
    id: order.id.getValue(),
    productId: order.productId.getValue() ?? "",
    buyerId: order.buyerId.getValue(),
    sellerId: order.sellerId.getValue(),
    finalPrice: order.finalPrice.getAmount(),
    status: order.status,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    completedAt: order.completedAt,
  };
};
