import { Module } from "@nestjs/common";
import { PaymentUseCasesModule } from "../../payment/application/payment-usecases.module";
import { ProductModule } from "../../product/product.module";
import { ProductRepository } from "../../product/repositories/product.repository";
import { CreatePurchaseHistoryUseCase } from "../../transaction-history/application/usecases/create-purchase-history";
import { CreateSaleHistoryUseCase } from "../../transaction-history/application/usecases/create-sale-history";
import { TransactionHistoryModule } from "../../transaction-history/transaction-history.module";
import { OrderRepositoryModule } from "../repositories/order.repository.module";
import { CompleteOrderUseCase } from "./usecases/complete-order";
import { CreateOrderUseCase } from "./usecases/create-order";
import { GetOrderUseCase } from "./usecases/get-order";
import { PurchaseProductService } from "./usecases/purchase-product";

@Module({
  imports: [ProductModule, OrderRepositoryModule, PaymentUseCasesModule],
  providers: [
    GetOrderUseCase,
    CreateOrderUseCase,
    CompleteOrderUseCase,
    PurchaseProductService,
    ProductRepository,
    CreatePurchaseHistoryUseCase,
    CreateSaleHistoryUseCase,
    {
      provide: "ITransactionHistoryRepository",
      useClass: TransactionHistoryModule,
    },
  ],
  exports: [
    GetOrderUseCase,
    CreateOrderUseCase,
    CompleteOrderUseCase,
    PurchaseProductService,
    CreatePurchaseHistoryUseCase,
  ],
})
export class OrderUseCasesModule {}
