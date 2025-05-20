import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaymentModule } from "../payment/payment.module";
import { ProductModule } from "../product/product.module";
import { ProductRepository } from "../product/repositories/product.repository";
import { TransactionHistoryModule } from "../transaction-history/transaction-history.module";
import { OrderUseCasesModule } from "./application/order-usecases.module";
import { OrderResolver } from "./presentation/order.resolver";
import { OrderRepositoryModule } from "./repositories/order.repository.module";

@Module({
  imports: [
    ProductModule,
    OrderUseCasesModule,
    OrderRepositoryModule,
    PaymentModule,
    TransactionHistoryModule,
  ],
  providers: [OrderResolver, PrismaService, ProductRepository],
  exports: [OrderResolver],
})
export class OrderModule {}
