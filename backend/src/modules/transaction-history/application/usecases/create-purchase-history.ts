// src/modules/transaction-history/application/usecases/create-purchase-history.ts
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { TransactionHistory } from "../../domain/transaction-history.entity";
import { EnumTransactionType } from "../../domain/transaction-history.value-objects";
import {
  TransactionHistoryDto,
  mapToHistoryPrimitive,
} from "../../presentation/transaction-history.dto";
import { ITransactionHistoryRepository } from "../../repositories/transaction-history.repository.interface";

@Injectable()
export class CreatePurchaseHistoryUseCase {
  // プロバイダーからPrismaServiceを直接注入
  constructor(
    private readonly prisma: PrismaService,
    @Inject("ITransactionHistoryRepository")
    private readonly transactionHistoryRepository: ITransactionHistoryRepository,
  ) {}

  async execute(buyerId: string, orderId: string): Promise<TransactionHistoryDto> {
    const transactionHistory = new TransactionHistory({
      userId: buyerId,
      orderId,
    });

    const purchaseHistory = transactionHistory.createPurchaseHistory();

    try {
      // DIをバイパスして直接データベースアクセス
      const transactionData = await this.prisma.transactionHistory.create({
        data: {
          userId: purchaseHistory.userId.getValue(),
          orderId: purchaseHistory.orderId.getValue(),
          type: purchaseHistory.type,
          createdAt: purchaseHistory.createdAt,
        },
      });

      // 結果をエンティティに変換
      const result = new TransactionHistory({
        id: transactionData.id,
        userId: transactionData.userId,
        orderId: transactionData.orderId,
        type: transactionData.type as EnumTransactionType, // EnumTransactionTypeへの変換が必要かもしれません
        createdAt: transactionData.createdAt,
      });

      return mapToHistoryPrimitive(result);
    } catch (error) {
      console.error("Detailed error in direct DB access:", error);
      throw new HttpException("Failed to create purchase transaction history", 422);
    }
  }
}
