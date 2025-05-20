// repositories/transaction-history.repository.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TransactionHistoryRepository } from "./transaction-history.repository";

@Module({
  imports: [PrismaModule], // ここで明示的にインポート

  providers: [
    TransactionHistoryRepository,
    {
      provide: "ITransactionHistoryRepository",
      useExisting: TransactionHistoryRepository, // useClass ではなく useExisting を使用
    },
  ],
  exports: ["ITransactionHistoryRepository"],
})
export class TransactionHistoryRepositoryModule {}
