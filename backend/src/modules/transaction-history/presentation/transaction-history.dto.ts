import { Field, ID, ObjectType } from "@nestjs/graphql";
import { TransactionHistory } from "../domain/transaction-history.entity";
import { EnumTransactionType } from "../domain/transaction-history.value-objects";

@ObjectType()
export class TransactionHistoryDto {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  orderId: string;

  @Field(() => String)
  type: EnumTransactionType;

  @Field()
  createdAt: Date;
}

export const mapToHistoryPrimitive = (
  transactionHistory: TransactionHistory,
): TransactionHistoryDto => {
  if (!transactionHistory.id) {
    throw new Error("Transaction history ID is not defined");
  }
  return {
    id: transactionHistory.id.getValue(),
    userId: transactionHistory.userId.getValue(),
    orderId: transactionHistory.orderId.getValue(),
    type: transactionHistory.type,
    createdAt: transactionHistory.createdAt,
  };
};
