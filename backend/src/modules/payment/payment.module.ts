import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaymentUseCasesModule } from "./application/payment-usecases.module";
import { PaymentResolver } from "./presentation/payment.resolver";
import { PaymentRepositoryModule } from "./repositories/payment.repository.module";

@Module({
  imports: [PaymentUseCasesModule, PaymentRepositoryModule],
  providers: [PaymentResolver, PrismaService],
  exports: [PaymentResolver],
})
export class PaymentModule {}
