import { Field, Float, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";
import { Payment } from "../domain/payment.entity";
import { EnumPaymentMethod, EnumPaymentStatus } from "../domain/payment.value-object";

@InputType()
export class ProcessPaymentInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  amount: number;

  @Field()
  @IsEnum(EnumPaymentMethod)
  method: EnumPaymentMethod;
}

@ObjectType()
export class PaymentResponseDto {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  orderId: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  fee: number;

  @Field()
  method: EnumPaymentMethod;

  @Field()
  status: EnumPaymentStatus;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  processedAt?: Date;
}

export const mapToPaymentPrimitive = (payment: Payment): PaymentResponseDto => {
  if (!payment.id) {
    throw new Error("Payment ID is not defined");
  }
  return {
    id: payment.id?.getValue(),
    orderId: payment.orderId.getValue(),
    amount: payment.amount.getAmount(),
    fee: payment.fee.getAmount(),
    method: payment.method,
    status: payment.status,
    createdAt: payment.createdAt,
    processedAt: payment.processedAt,
  };
};
