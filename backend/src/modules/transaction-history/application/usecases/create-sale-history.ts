import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { TransactionHistory } from "../../domain/transaction-history.entity";
import { EnumTransactionType } from "../../domain/transaction-history.value-objects";
import {
  TransactionHistoryDto,
  mapToHistoryPrimitive,
} from "../../presentation/transaction-history.dto";

@Injectable()
export class CreateSaleHistoryUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, orderId: string): Promise<TransactionHistoryDto> {
    try {
      // TransactionHistoryエンティティを作成
      const transactionHistory = new TransactionHistory({
        userId,
        orderId,
      });

      // 販売履歴を作成
      const salesHistory = transactionHistory.createSaleHistory();

      // リポジトリをバイパスして直接Prismaでデータベースアクセス
      const transactionData = await this.prisma.transactionHistory.create({
        data: {
          userId: salesHistory.userId.getValue(),
          orderId: salesHistory.orderId.getValue(),
          type: salesHistory.type,
          createdAt: salesHistory.createdAt,
        },
      });

      // 返却用のエンティティを作成
      const result = new TransactionHistory({
        id: transactionData.id,
        userId: transactionData.userId,
        orderId: transactionData.orderId,
        type: transactionData.type as EnumTransactionType, // 必要に応じてEnumへの変換
        createdAt: transactionData.createdAt,
      });

      return mapToHistoryPrimitive(result);
    } catch (error) {
      console.error("Sale history creation error:", error);
      throw new HttpException(`Failed to create sale transaction history: ${error.message}`, 422);
    }
  }
}
