import { Module } from "@nestjs/common";
import { TransactionHistoryRepositoryModule } from "../repositories/transaction-history.repository.module";
import { CreatePurchaseHistoryUseCase } from "./usecases/create-purchase-history";
import { CreateSaleHistoryUseCase } from "./usecases/create-sale-history";
import { GetUserTransactionHistoriesUseCase } from "./usecases/get-user-transaction-histories";

@Module({
  imports: [TransactionHistoryRepositoryModule],
  providers: [
    GetUserTransactionHistoriesUseCase,
    CreatePurchaseHistoryUseCase,
    CreateSaleHistoryUseCase,
  ],
  exports: [
    GetUserTransactionHistoriesUseCase,
    CreatePurchaseHistoryUseCase,
    CreateSaleHistoryUseCase,
  ],
})
export class TransactionHistoryUseCasesModule {}
