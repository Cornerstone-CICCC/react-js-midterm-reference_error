import { UserId } from "../..//user/domain/user.value-objects";
import { TransactionHistory } from "../domain/transaction-history.entity";

export interface ITransactionHistoryRepository {
  findByUser(userId: UserId): Promise<TransactionHistory[]>;
  save(history: TransactionHistory): Promise<TransactionHistory | null>;
}
