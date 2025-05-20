import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserId } from "../../user/domain/user.value-objects";
import { TransactionHistory } from "../domain/transaction-history.entity";
import { EnumTransactionType } from "../domain/transaction-history.value-objects";
import { ITransactionHistoryRepository } from "./transaction-history.repository.interface";

@Injectable()
export class TransactionHistoryRepository implements ITransactionHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: UserId): Promise<TransactionHistory[]> {
    const histories = await this.prisma.transactionHistory.findMany({
      where: {
        userId: userId.getValue(),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return histories.map((history) => {
      return new TransactionHistory({
        id: history.id,
        userId: history.userId,
        orderId: history.orderId,
        type: history.type as EnumTransactionType,
        createdAt: history.createdAt,
      });
    });
  }

  async save(history: TransactionHistory): Promise<TransactionHistory | null> {
    if (!history.hasId()) {
      const transactionHistory = await this.prisma.transactionHistory.create({
        data: {
          userId: history.userId.getValue(),
          orderId: history.orderId.getValue(),
          type: history.type,
          createdAt: history.createdAt,
        },
      });
      return new TransactionHistory({
        id: transactionHistory.id,
        userId: transactionHistory.userId,
        orderId: transactionHistory.orderId,
        type: EnumTransactionType[transactionHistory.type],
        createdAt: transactionHistory.createdAt,
      });
    }

    return null;
  }
}
