import { Module } from "@nestjs/common";
import { TransactionHistoryUseCasesModule } from "./application/transaction-history.usecases.module";
import { TransactionHistoryResolver } from "./presentation/transaction-history.resolver";
import { TransactionHistoryRepositoryModule } from "./repositories/transaction-history.repository.module";

@Module({
  imports: [TransactionHistoryUseCasesModule, TransactionHistoryRepositoryModule],
  providers: [TransactionHistoryResolver],
  exports: [TransactionHistoryUseCasesModule, TransactionHistoryResolver],
})
export class TransactionHistoryModule {}
